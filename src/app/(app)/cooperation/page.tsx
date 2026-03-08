"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Copy, Check, Handshake } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com";

export default function CooperationPage() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t.cooperationTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.cooperationSubtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Handshake className="h-4 w-4" />
            {t.cooperationTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">{t.cooperationDesc}</p>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t.cooperationEmail}</p>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2.5">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-mono">{EMAIL}</span>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    {t.shareCopied}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {t.copy}
                  </>
                )}
              </Button>
            </div>
          </div>

          <Button className="w-full gap-2" asChild>
            <a href={`mailto:${EMAIL}`}>
              <Mail className="h-4 w-4" />
              {t.cooperationEmail}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
