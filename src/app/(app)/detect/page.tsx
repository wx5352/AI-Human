"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanSearch, ShieldCheck, ShieldAlert, TriangleAlert, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface AiBreakdown {
  vocabulary: number;
  structure: number;
  flow: number;
  voice: number;
}

export default function DetectPage() {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiRate, setAiRate] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<AiBreakdown | null>(null);

  const handleDetect = async () => {
    if (!text.trim()) {
      toast.error(t.toastNoText);
      return;
    }
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 10) {
      toast.error(t.toastTooShort);
      return;
    }
    if (wordCount > 2000) {
      toast.error(t.toastTooLong);
      return;
    }

    setLoading(true);
    setAiRate(null);
    setBreakdown(null);

    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || t.toastFailed);
        return;
      }
      setAiRate(data.aiRate);
      setBreakdown(data.breakdown);
    } catch {
      toast.error(t.toastNetworkError);
    } finally {
      setLoading(false);
    }
  };

  const getAiRateColor = (rate: number) => {
    if (rate <= 19) return "text-green-600";
    if (rate <= 35) return "text-yellow-600";
    return "text-red-600";
  };

  const getAiRateBg = (rate: number) => {
    if (rate <= 19) return "stroke-green-500";
    if (rate <= 35) return "stroke-yellow-500";
    return "stroke-red-500";
  };

  const getAiRateTrail = (rate: number) => {
    if (rate <= 19) return "stroke-green-100";
    if (rate <= 35) return "stroke-yellow-100";
    return "stroke-red-100";
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

  const getBarBg = (rate: number) => {
    if (rate <= 19) return "bg-green-500";
    if (rate <= 35) return "bg-yellow-500";
    return "bg-red-500";
  };

  // SVG pie/gauge chart helper
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = aiRate !== null ? circumference - (aiRate / 100) * circumference : circumference;

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t.detectTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.detectSubtitle}</p>
      </div>

      {/* Text input */}
      <div className="mb-4">
        <Textarea
          placeholder={t.detectPlaceholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          className="h-[360px] resize-none text-sm leading-relaxed overflow-y-auto"
          style={{ fieldSizing: "fixed" as never }}
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {text.trim() ? text.trim().split(/\s+/).length : 0} {t.words}
          </span>
          <Button
            onClick={handleDetect}
            disabled={loading || !text.trim()}
            className="gap-2"
          >
            {loading ? (
              <>
                <ScanSearch className="h-4 w-4 animate-spin" />
                {t.detecting}
              </>
            ) : (
              <>
                <ScanSearch className="h-4 w-4" />
                {t.detectButton}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results */}
      {aiRate !== null && breakdown ? (
        <>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Gauge chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.detectResult}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <svg width="180" height="180" className="-rotate-90">
                    <circle cx="90" cy="90" r={radius} fill="none" strokeWidth="12" className={getAiRateTrail(aiRate)} />
                    <circle cx="90" cy="90" r={radius} fill="none" strokeWidth="12" strokeLinecap="round" className={getAiRateBg(aiRate)}
                      style={{ strokeDasharray: circumference, strokeDashoffset, transition: "stroke-dashoffset 1s ease-in-out" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold font-mono ${getAiRateColor(aiRate)}`}>{aiRate}%</span>
                    <span className="text-xs text-muted-foreground">{t.aiRateLabel}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-2 text-sm ${getAiRateColor(aiRate)}`}>
                  {(() => { const Icon = getAiRateIcon(aiRate); return <Icon className="h-4 w-4" />; })()}
                  {getAiRateStatus(aiRate)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t.detailBreakdown}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: t.vocabulary, value: breakdown.vocabulary },
                  { label: t.structure, value: breakdown.structure },
                  { label: t.flow, value: breakdown.flow },
                  { label: t.voice, value: breakdown.voice },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span>{item.label}</span>
                      <span className={`font-mono font-semibold ${getAiRateColor(item.value)}`}>{item.value}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div className={`h-full rounded-full transition-all duration-500 ${getBarBg(item.value)}`} style={{ width: `${Math.min(item.value, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Turnitin disclaimer */}
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{t.turnitinDisclaimer}</span>
        </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ScanSearch className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{t.detectSubtitle}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
