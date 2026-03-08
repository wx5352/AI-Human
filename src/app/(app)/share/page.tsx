"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Gift, Share2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function SharePage() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [bonusUsed, setBonusUsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReferralCode = useCallback(async () => {
    try {
      const res = await fetch("/api/referral/code");
      const data = await res.json();
      if (res.ok) {
        setReferralCode(data.referralCode);
        setBonusUsed(data.referralBonusUsed);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (session) fetchReferralCode();
  }, [session, fetchReferralCode]);

  const shareUrl = referralCode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${referralCode}`
    : "";

  const qrCodeUrl = referralCode
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`
    : "";

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t.shareTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.shareSubtitle}</p>
      </div>

      {/* Referral link */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Share2 className="h-4 w-4" />
            {t.shareLink}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{t.shareLinkDesc}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1 overflow-hidden rounded-lg border bg-muted/50 px-3 py-2">
              <p className="truncate text-sm font-mono">{shareUrl}</p>
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
                  {t.shareCopyLink}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Code */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">{t.shareQrCode}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          {qrCodeUrl && (
            <div className="rounded-lg border bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCodeUrl} alt="QR Code" width={200} height={200} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bonus info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gift className="h-4 w-4" />
            {t.shareBonus}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{t.shareBonusDesc}</p>
          <Badge variant={bonusUsed ? "secondary" : "default"}>
            {bonusUsed ? "+3 ✓" : "+3"}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
