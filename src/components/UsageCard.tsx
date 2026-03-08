"use client";

import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

interface UsageCardProps {
  usageCount: number;
  maxUsage: number;
}

export function UsageCard({ usageCount, maxUsage }: UsageCardProps) {
  const { t } = useI18n();
  const remaining = maxUsage - usageCount;
  const percentage = (usageCount / maxUsage) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{t.todayRemaining}</span>
        <Badge
          variant={remaining <= 2 ? "destructive" : "secondary"}
          className="font-mono"
        >
          {remaining}/{maxUsage}
        </Badge>
      </div>
      <div className="hidden h-2 w-24 overflow-hidden rounded-full bg-secondary sm:block">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            percentage >= 80
              ? "bg-destructive"
              : percentage >= 50
              ? "bg-yellow-500"
              : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
