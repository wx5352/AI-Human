"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Copy, Loader2, ShieldCheck, ShieldAlert, TriangleAlert, Info } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

interface AiBreakdown {
  vocabulary: number;
  structure: number;
  flow: number;
  voice: number;
}

interface ResultDisplayProps {
  value: string;
  loading: boolean;
  aiRate?: number | null;
  breakdown?: AiBreakdown | null;
}

export function ResultDisplay({ value, loading, aiRate, breakdown }: ResultDisplayProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

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

  const getAiRateStatus = (rate: number) => {
    if (rate <= 19) return { icon: ShieldCheck, text: t.aiRatePass, color: "text-green-600" };
    if (rate <= 35) return { icon: TriangleAlert, text: t.aiRateWarning, color: "text-yellow-600" };
    return { icon: ShieldAlert, text: t.aiRateFail, color: "text-red-600" };
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{t.rewriteResult}</Label>
        <div className="flex items-center gap-2">
          {value && (
            <Badge variant="secondary" className="font-mono text-xs">
              {wordCount} {t.words}
            </Badge>
          )}
          {value && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
              title={t.copy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* AI Rate Card */}
      {aiRate !== null && aiRate !== undefined && value && !loading && (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">{t.estimatedAiRate}</span>
            <span className={`text-2xl font-bold font-mono ${getAiRateColor(aiRate)}`}>
              {aiRate}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary mb-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getAiRateBg(aiRate)}`}
              style={{ width: `${Math.min(aiRate, 100)}%` }}
            />
          </div>
          {/* Status */}
          {(() => {
            const status = getAiRateStatus(aiRate);
            const Icon = status.icon;
            return (
              <div className={`flex items-center gap-2 text-xs ${status.color}`}>
                <Icon className="h-3.5 w-3.5" />
                {status.text}
              </div>
            );
          })()}
          {/* Breakdown */}
          {breakdown && (
            <div className="mt-3 grid grid-cols-2 gap-2 pt-3 border-t">
              {[
                { label: t.vocabulary, value: breakdown.vocabulary },
                { label: t.structure, value: breakdown.structure },
                { label: t.flow, value: breakdown.flow },
                { label: t.voice, value: breakdown.voice },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={`font-mono font-medium ${getAiRateColor(item.value)}`}>
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          )}
          {/* Turnitin disclaimer */}
          <div className="mt-3 flex items-center gap-1.5 pt-2 border-t text-[11px] text-muted-foreground">
            <Info className="h-3 w-3 shrink-0" />
            <span>{t.turnitinDisclaimer}</span>
          </div>
        </div>
      )}

      <div className="relative min-h-0 flex-1">
        <Textarea
          placeholder={loading ? t.loadingPlaceholder : t.resultPlaceholder}
          value={value}
          readOnly
          className="h-full resize-none text-sm leading-relaxed overflow-y-auto"
          style={{ fieldSizing: "fixed" }}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-background/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                {t.aiRewriting}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
