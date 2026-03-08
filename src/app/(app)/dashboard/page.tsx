"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ShieldCheck,
  ShieldAlert,
  TriangleAlert,
  BarChart3,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

interface LastResult {
  aiRate: number;
  breakdown: {
    vocabulary: number;
    structure: number;
    flow: number;
    voice: number;
  };
  wordCount: number;
  mode: string;
  timestamp: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const [usage, setUsage] = useState({ usageCount: 0, maxUsage: 10 });
  const [lastResult, setLastResult] = useState<LastResult | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/usage");
      const data = await res.json();
      if (res.ok) setUsage(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (session) {
      fetchUsage();
      const saved = sessionStorage.getItem("lastRewriteResult");
      if (saved) {
        try { setLastResult(JSON.parse(saved)); } catch { /* ignore */ }
      }
    }
  }, [session, fetchUsage]);

  const getAiRateColor = (rate: number) => {
    if (rate <= 19) return "text-green-600";
    if (rate <= 35) return "text-yellow-600";
    return "text-red-600";
  };

  const getAiRateBg = (rate: number) => {
    if (rate <= 19) return "bg-green-500";
    if (rate <= 35) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getAiRateIcon = (rate: number) => {
    if (rate <= 19) return ShieldCheck;
    if (rate <= 35) return TriangleAlert;
    return ShieldAlert;
  };

  const getAiRateStatus = (rate: number) => {
    if (rate <= 19) return t.aiRatePass;
    if (rate <= 35) return t.aiRateWarning;
    return t.aiRateFail;
  };

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const remaining = usage.maxUsage - usage.usageCount;
  const usagePercent = (usage.usageCount / usage.maxUsage) * 100;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t.dashboardTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.dashboardSubtitle}</p>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.todayUsage}</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              {usage.usageCount}
              <span className="text-lg text-muted-foreground">/{usage.maxUsage}</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full transition-all ${
                  usagePercent >= 80 ? "bg-destructive" : usagePercent >= 50 ? "bg-yellow-500" : "bg-primary"
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {remaining} {t.todayRemaining.replace(":", "")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.overallAiRate}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {lastResult ? (
              <>
                <div className={`text-3xl font-bold font-mono ${getAiRateColor(lastResult.aiRate)}`}>
                  {lastResult.aiRate}%
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all ${getAiRateBg(lastResult.aiRate)}`}
                    style={{ width: `${Math.min(lastResult.aiRate, 100)}%` }}
                  />
                </div>
                <div className={`mt-2 flex items-center gap-1.5 text-xs ${getAiRateColor(lastResult.aiRate)}`}>
                  {(() => {
                    const Icon = getAiRateIcon(lastResult.aiRate);
                    return <Icon className="h-3 w-3" />;
                  })()}
                  {getAiRateStatus(lastResult.aiRate)}
                </div>
              </>
            ) : (
              <div className="text-3xl font-bold font-mono text-muted-foreground">--</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Last rewrite result detail */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.lastResult}</CardTitle>
        </CardHeader>
        <CardContent>
          {lastResult ? (
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 text-sm font-medium text-muted-foreground">{t.detailBreakdown}</h4>
                <div className="space-y-4">
                  {[
                    { label: t.vocabulary, value: lastResult.breakdown.vocabulary },
                    { label: t.structure, value: lastResult.breakdown.structure },
                    { label: t.flow, value: lastResult.breakdown.flow },
                    { label: t.voice, value: lastResult.breakdown.voice },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className={`font-mono font-semibold ${getAiRateColor(item.value)}`}>
                          {item.value}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getAiRateBg(item.value)}`}
                          style={{ width: `${Math.min(item.value, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{t.noResultYet}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{t.noResultDesc}</p>
              <Link href="/rewrite">
                <Button>{t.goRewrite}</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
