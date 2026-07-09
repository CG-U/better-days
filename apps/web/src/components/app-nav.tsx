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
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/urges", label: "Track", icon: Zap },
  { href: "/checkins", label: "Daily", icon: NotebookPen },
  { href: "/analytics", label: "Trends", icon: BarChart3 },
  { href: "/relapses", label: "Setbacks", icon: HeartHandshake },
] as const;

// /settings has no tab of its own but is still an app page, so the nav shows.
const NAV_PAGES = [...TABS.map((tab) => tab.href), "/settings"];

/** The nav only shows on app pages, never on auth or dev pages. */
function useNavVisible(): boolean {
  const pathname = usePathname();
  return NAV_PAGES.some((page) => pathname.startsWith(page));
}

/**
 * App navigation. The product is used on both phones and desktop browsers, so
 * this renders as a thumb-reachable bottom bar on small screens and a
 * conventional top bar from `md` up — one source of truth for the tab list.
 *
 * Render this *before* page content (the top bar is sticky) and pair it with
 * <AppNavSpacer /> *after* page content, which reserves room for the fixed
 * mobile bar.
 */
export function AppNav() {
  const pathname = usePathname();
  const visible = useNavVisible();

  if (!visible) {
    return null;
  }

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      {/* Desktop: sticky top bar. */}
      <header className="sticky top-0 z-40 hidden border-b border-border bg-card/95 backdrop-blur md:block">
        <div className="mx-auto flex w-full max-w-[1040px] items-center gap-6 px-6 py-3">
          <Link
            href="/dashboard"
            className="focus-ring rounded-lg font-heading text-lg font-bold text-primary"
          >
            Better Days
          </Link>
          <nav aria-label="Main" className="flex flex-1 items-center gap-1">
            {TABS.map((tab) => {
              const active = isActive(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "focus-ring flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors duration-200 ease-in-out",
                    active
                      ? "bg-primary-container/50 text-on-primary-container"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <tab.icon aria-hidden className="size-4" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
          <UserMenu />
        </div>
      </header>

      {/* Mobile: fixed bottom bar. */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <div className="mx-auto flex w-full max-w-xl items-stretch justify-between px-2">
          {TABS.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className="focus-ring flex min-h-12 flex-1 flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-bold"
              >
                <span
                  className={cn(
                    "flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200 ease-in-out",
                    active
                      ? "bg-primary-container/50 text-on-primary-container"
                      : "text-muted-foreground",
                  )}
                >
                  <tab.icon aria-hidden className="size-5" />
                </span>
                <span
                  className={active ? "text-primary" : "text-muted-foreground"}
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

/** Keeps page content from hiding behind the fixed mobile bar. */
export function AppNavSpacer() {
  const visible = useNavVisible();
  return visible ? <div aria-hidden className="h-24 md:hidden" /> : null;
}
