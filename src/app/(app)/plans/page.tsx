"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function PlansPage() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const [currentPlan, setCurrentPlan] = useState<string>("free");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (res.ok) setCurrentPlan(data.plan || "free");
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (session) fetchProfile();
  }, [session, fetchProfile]);

  const plans = [
    {
      id: "free",
      name: t.planFreeTitle,
      desc: t.planFreeDesc,
      price: t.planFreePrice,
      period: "",
      features: [
        `1 ${t.usesPerDay}`,
        `1000 ${t.wordsPerUse}`,
        t.navAiRewrite,
        t.navAiDetect,
      ],
      highlight: false,
    },
    {
      id: "week",
      name: t.planWeekTitle,
      desc: t.planWeekDesc,
      price: t.planWeekPrice,
      period: t.perWeek,
      features: [
        `10 ${t.usesPerDay}`,
        `3000 ${t.wordsPerUse}`,
        t.navAiRewrite,
        t.navAiDetect,
        t.dashboard,
      ],
      highlight: false,
    },
    {
      id: "pro",
      name: t.planProTitle,
      desc: t.planProDesc,
      price: t.planProPrice,
      period: t.perMonth,
      features: [
        `10 ${t.usesPerDay}`,
        `5000 ${t.wordsPerUse}`,
        t.navAiRewrite,
        t.navAiDetect,
        t.dashboard,
      ],
      highlight: true,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">{t.plansTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.plansSubtitle}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.highlight ? "border-primary shadow-md" : ""
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{plan.desc}</p>
                <div className="mt-3">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground"> {plan.period}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col pt-2">
                <ul className="flex-1 space-y-2.5 mb-5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button variant="outline" disabled className="w-full" size="sm">
                    {t.planCurrent}
                  </Button>
                ) : plan.id === "free" ? (
                  <Button variant="outline" disabled className="w-full" size="sm">
                    {t.planFreeTitle}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    size="sm"
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {t.planContactUs}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
