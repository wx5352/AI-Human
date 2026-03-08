"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, CreditCard } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const [profile, setProfile] = useState<{
    plan: string;
    usageCount: number;
    maxUsage: number;
  } | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (res.ok) setProfile(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (session) fetchProfile();
  }, [session, fetchProfile]);

  const isPro = profile?.plan === "pro";

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t.profileTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.profileSubtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
              <AvatarFallback className="text-lg">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{session?.user?.name}</CardTitle>
              <Badge variant={isPro ? "default" : "secondary"} className="mt-1">
                {isPro ? t.planPro : t.planFree}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t.accountName}</p>
              <p className="text-sm font-medium">{session?.user?.name || "—"}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t.accountEmail}</p>
              <p className="text-sm font-medium">{session?.user?.email || "—"}</p>
            </div>
          </div>

          {/* Plan */}
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{t.accountPlan}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{isPro ? t.planPro : t.planFree}</p>
                <span className="text-xs text-muted-foreground">
                  ({profile?.maxUsage ?? "—"} {t.usesPerDay})
                </span>
              </div>
            </div>
          </div>

          {!isPro && (
            <div className="pt-2">
              <Link href="/plans">
                <Button className="w-full">{t.planUpgrade}</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
