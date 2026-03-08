"use client";

import { type RewriteMode } from "@/lib/prompts";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface ModeSelectorProps {
  value: RewriteMode;
  onChange: (mode: RewriteMode) => void;
  disabled?: boolean;
}

export function ModeSelector({ value, onChange, disabled }: ModeSelectorProps) {
  const { t } = useI18n();

  const modes: { value: RewriteMode; label: string; description: string }[] = [
    {
      value: "light",
      label: t.modeLight,
      description: t.modeLightDesc,
    },
    {
      value: "medium",
      label: t.modeMedium,
      description: t.modeMediumDesc,
    },
    {
      value: "deep",
      label: t.modeDeep,
      description: t.modeDeepDesc,
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onChange(mode.value)}
          disabled={disabled}
          className={cn(
            "flex flex-col items-start rounded-lg border px-4 py-3 text-left transition-all hover:border-primary/50 hover:bg-accent",
            value === mode.value
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "border-border",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <span className="text-sm font-medium">{mode.label}</span>
          <span className="text-xs text-muted-foreground">
            {mode.description}
          </span>
        </button>
      ))}
    </div>
  );
}
