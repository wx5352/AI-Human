"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ClipboardPaste, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TextEditor({ value, onChange, disabled }: TextEditorProps) {
  const { t } = useI18n();
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{t.originalText}</Label>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            {wordCount} {t.words}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handlePaste}
            disabled={disabled}
            title={t.paste}
          >
            <ClipboardPaste className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => onChange("")}
            disabled={disabled || !value}
            title={t.clear}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <Textarea
        placeholder={t.editorPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="min-h-0 flex-1 resize-none text-sm leading-relaxed overflow-y-auto"
        style={{ fieldSizing: "fixed" }}
      />
    </div>
  );
}
