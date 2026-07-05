"use client";

import { NotebookPen, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { useLogout, useMe } from "@/features/auth/hooks/use-auth";
import { RecentActivity } from "@/features/dashboard/components/recent-activity";
import { RecoverySetupForm } from "@/features/dashboard/components/recovery-setup-form";
import { StatCards } from "@/features/dashboard/components/stat-cards";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";

// Client-only value: the server (possibly in another timezone) renders a
// neutral greeting, and the client swaps in the local time of day.
const emptySubscribe = () => () => {};

function getLocalGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function useGreeting(): string {
  return useSyncExternalStore(
    emptySubscribe,
    getLocalGreeting,
    () => "Welcome back",
  );
}

export default function DashboardPage() {
  const me = useMe();
  const dashboard = useDashboard();
  const logout = useLogout();
  const greeting = useGreeting();

  const displayName = me.data?.user.email.split("@")[0];

  return (
    <main className="mx-auto flex w-full max-w-[1040px] flex-col gap-6 p-5 md:p-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Better Days
        </h1>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          {logout.isPending ? "Signing out..." : "Sign out"}
        </Button>
      </header>

      <section className="space-y-1">
        <h2 className="font-heading text-3xl font-bold">
          {greeting}
          {displayName ? `, ${displayName}` : ""}
        </h2>
        <p className="text-lg text-muted-foreground">
          Today is a fresh opportunity to be kind to yourself.
        </p>
      </section>

      {dashboard.isPending ? (
        <p className="text-muted-foreground">Loading your progress...</p>
      ) : dashboard.isError ? (
        <p className="text-muted-foreground">
          We could not load your dashboard. Please refresh to try again.
        </p>
      ) : !dashboard.data.setupComplete || !dashboard.data.stats ? (
        <RecoverySetupForm />
      ) : (
        <>
          <StatCards stats={dashboard.data.stats} />

          <section aria-label="Quick actions" className="flex flex-col gap-3">
            <Button className="h-12 w-full rounded-full" disabled>
              <NotebookPen aria-hidden className="size-5" />
              Daily Check-in
            </Button>
            <Button
              render={<Link href="/urges/new" />}
              variant="outline"
              className="h-12 w-full rounded-full border-primary text-primary"
            >
              <TriangleAlert aria-hidden className="size-5" />
              Log an Urge
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Daily check-ins are coming in a future update.
            </p>
          </section>

          <RecentActivity items={dashboard.data.recentActivity} />

          <figure className="rounded-2xl bg-primary p-8 text-primary-foreground">
            <blockquote className="font-heading text-xl font-semibold italic">
              &ldquo;One day at a time is the only pace that works.&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-sm text-primary-foreground/80">
              — Gentle Reminder
            </figcaption>
          </figure>
        </>
      )}
    </main>
  );
}
