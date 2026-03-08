"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TextEditor } from "@/components/TextEditor";
import { ResultDisplay } from "@/components/ResultDisplay";
import { type RewriteMode } from "@/lib/prompts";
import { Sparkles, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export type GhostModel = "ghost4.0" | "ghost4.1";

const GHOST_MODELS: { value: GhostModel; label: string }[] = [
  { value: "ghost4.0", label: "Ghost 4.0" },
  { value: "ghost4.1", label: "Ghost 4.1" },
];

export default function RewritePage() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const mode: RewriteMode = "deep";
  const [ghostModel, setGhostModel] = useState<GhostModel>("ghost4.0");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState({ usageCount: 0, maxUsage: 10 });
  const [aiRate, setAiRate] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<{
    vocabulary: number;
    structure: number;
    flow: number;
    voice: number;
  } | null>(null);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/usage");
      const data = await res.json();
      if (res.ok) setUsage(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (session) fetchUsage();
  }, [session, fetchUsage]);

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      toast.error(t.toastNoText);
      return;
    }

    const wordCount = inputText.trim().split(/\s+/).length;
    if (wordCount > 2000) {
      toast.error(t.toastTooLong);
      return;
    }
    if (wordCount < 10) {
      toast.error(t.toastTooShort);
      return;
    }

    setLoading(true);
    setOutputText("");
    setAiRate(null);
    setBreakdown(null);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, mode, ghostModel }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || t.toastFailed);
        if (data.usageCount !== undefined) {
          setUsage({ usageCount: data.usageCount, maxUsage: data.maxUsage });
        }
        return;
      }

      setOutputText(data.rewrittenText);
      setAiRate(data.aiRate ?? null);
      setBreakdown(data.breakdown ?? null);
      setUsage({ usageCount: data.usageCount, maxUsage: data.maxUsage });
      toast.success(t.toastSuccess);
    } catch {
      toast.error(t.toastNetworkError);
    } finally {
      setLoading(false);
    }
  };

  const remaining = usage.maxUsage - usage.usageCount;

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.editorTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.editorSubtitle}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{t.todayRemaining}</span>
          <span className="font-mono font-bold text-foreground">
            {remaining}/{usage.maxUsage}
          </span>
        </div>
      </div>

      {/* Mode is fixed to deep */}

      {/* Model selector */}
      <div className="mb-3 inline-flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Model</span>
        <div className="relative">
          <select
            value={ghostModel}
            onChange={(e) => setGhostModel(e.target.value as GhostModel)}
            disabled={loading}
            className="appearance-none rounded-md border bg-background px-3 py-1.5 pr-8 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 cursor-pointer"
          >
            {GHOST_MODELS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Editor panels */}
      <div className="grid gap-6 lg:grid-cols-2 lg:h-[520px]">
        <TextEditor value={inputText} onChange={setInputText} disabled={loading} />
        <ResultDisplay value={outputText} loading={loading} aiRate={aiRate} breakdown={breakdown} />
      </div>

      {/* Action button */}
      <div className="mt-6 flex justify-center">
        <Button
          size="lg"
          onClick={handleRewrite}
          disabled={loading || !inputText.trim()}
          className="min-w-[200px] gap-2 text-base"
        >
          {loading ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" />
              {t.rewriting}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {t.startRewrite}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
