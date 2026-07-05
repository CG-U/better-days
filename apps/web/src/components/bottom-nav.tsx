"use client";

import {
  BarChart3,
  HeartHandshake,
  Home,
  NotebookPen,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/urges", label: "Track", icon: Zap },
  { href: "/checkins", label: "Daily", icon: NotebookPen },
  { href: "/analytics", label: "Trends", icon: BarChart3 },
  { href: "/relapses", label: "Setbacks", icon: HeartHandshake },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const visible = TABS.some((tab) => pathname.startsWith(tab.href));

  if (!visible) {
    return null;
  }

  return (
    <>
      {/* Spacer so page content never hides behind the fixed bar. */}
      <div aria-hidden className="h-24" />
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-xl items-stretch justify-between px-2">
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-bold"
              >
                <span
                  className={cn(
                    "flex h-8 w-14 items-center justify-center rounded-full transition-colors",
                    active
                      ? "bg-primary-container/50 text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <tab.icon aria-hidden className="size-5" />
                </span>
                <span
                  className={
                    active ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
