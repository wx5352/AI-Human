"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import {
  FileText,
  ScanSearch,
  BarChart3,
  User,
  CreditCard,
  Share2,
  MessageSquare,
  Handshake,
  Atom,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const toolsItems: NavItem[] = [
    { href: "/rewrite", label: t.navAiRewrite, icon: FileText },
    { href: "/detect", label: t.navAiDetect, icon: ScanSearch },
    { href: "/dashboard", label: t.dashboard, icon: BarChart3 },
  ];

  const accountItems: NavItem[] = [
    { href: "/profile", label: t.navProfile, icon: User },
    { href: "/plans", label: t.navPlans, icon: CreditCard },
  ];

  const shareItems: NavItem[] = [
    { href: "/share", label: t.navShare, icon: Share2 },
    { href: "/feedback", label: t.navFeedback, icon: MessageSquare },
  ];

  const businessItems: NavItem[] = [
    { href: "/cooperation", label: t.navCooperation, icon: Handshake },
  ];

  const sections = [
    { title: t.navTools, items: toolsItems },
    { title: t.navAccount, items: accountItems },
    { title: t.navShareSupport, items: shareItems },
    { title: t.navBusiness, items: businessItems },
  ];

  return (
    <aside className="flex h-full w-60 flex-col border-e bg-background">
      {/* Brand */}
      <Link href="/rewrite" className="flex h-14 items-center gap-2 border-b px-4 hover:bg-muted transition-colors">
        <Atom className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold tracking-tight">{t.brand}</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
