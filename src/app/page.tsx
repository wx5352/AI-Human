"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Shield, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/rewrite");
    }
  }, [status, router]);

  if (status === "loading" || session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] flex-col">
        {/* Hero */}
        <section className="flex flex-1 flex-col items-center justify-center px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t.heroTitle1}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {t.heroTitle2}
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="gap-2 text-base">
                  {t.heroCta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/30 px-4 py-16">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{t.featureSmartTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.featureSmartDesc}</p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{t.featureLowAiTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.featureLowAiDesc}</p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{t.featureFastTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.featureFastDesc}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
