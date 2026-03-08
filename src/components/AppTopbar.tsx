"use client";

import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Sun, Moon, Globe, Check } from "lucide-react";
import { useI18n, LOCALE_NAMES, LOCALES, type Locale } from "@/lib/i18n";
import { useEffect, useState } from "react";

export function AppTopbar() {
  const { data: session } = useSession();
  const { locale, t, setLocale } = useI18n();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-end border-b bg-background px-4 gap-2">
      {/* Language selector */}
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

      {/* Theme toggle */}
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      {/* User avatar + dropdown */}
      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted transition-colors outline-none">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-start">
                <p className="text-sm font-medium leading-tight">{session.user.name}</p>
                <p className="text-xs text-muted-foreground leading-tight">{session.user.email}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t.signOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
