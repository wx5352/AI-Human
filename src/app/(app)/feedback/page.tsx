"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export default function FeedbackPage() {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (res.ok) {
        toast.success(t.feedbackSuccess);
        setText("");
      } else {
        const data = await res.json();
        toast.error(data.error || t.feedbackError);
      }
    } catch {
      toast.error(t.feedbackError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t.feedbackTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.feedbackSubtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4" />
            {t.feedbackTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder={t.feedbackPlaceholder}
              value={text}
              onChange={(e) => {
                if (e.target.value.length <= 100) setText(e.target.value);
              }}
              disabled={loading}
              className="min-h-[120px] resize-none text-sm"
              maxLength={100}
            />
            <p className="mt-1.5 text-end text-xs text-muted-foreground">
              {text.length}/100 {t.feedbackCharCount}
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="w-full gap-2"
          >
            {loading ? (
              <>
                <Send className="h-4 w-4 animate-spin" />
                {t.feedbackSubmitting}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t.feedbackSubmit}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
