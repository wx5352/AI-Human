"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Atom, Globe, Check } from "lucide-react";
import { useI18n, LOCALE_NAMES, LOCALES, type Locale } from "@/lib/i18n";

export function Navbar() {
  const { locale, t, setLocale } = useI18n();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Atom className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">{t.brand}</span>
        </Link>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 text-sm">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{LOCALE_NAMES[locale]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {LOCALES.map((loc) => (
                <DropdownMenuItem
                  key={loc}
                  className="cursor-pointer justify-between"
                  onClick={() => setLocale(loc as Locale)}
                >
                  {LOCALE_NAMES[loc as Locale]}
                  {locale === loc && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/login">
            <Button size="sm">{t.signIn}</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
