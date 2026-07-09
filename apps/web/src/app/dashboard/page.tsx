"use client";

import { NotebookPen, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { QueryError } from "@/components/query-error";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserMenu } from "@/components/user-menu";
import { useMe } from "@/features/auth/hooks/use-auth";
import { CheckInPrompt } from "@/features/checkins/components/checkin-prompt";
import { MilestoneBand } from "@/features/dashboard/components/milestone-band";
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

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-72 rounded-2xl sm:row-span-3" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <Skeleton className="h-12 flex-1 rounded-full" />
        <Skeleton className="h-12 flex-1 rounded-full" />
      </div>
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );
}

export default function DashboardPage() {
  const me = useMe();
  const dashboard = useDashboard();
  const greeting = useGreeting();

  // Prefer the chosen username; fall back to the email local-part.
  const displayName =
    me.data?.user.username ?? me.data?.user.email.split("@")[0];

  return (
    <main className="mx-auto flex w-full max-w-[1040px] flex-col gap-6 p-5 md:p-10">
      {/* From md up the brand and account menu live in the sticky top nav. */}
      <header className="flex items-center justify-between gap-3 md:hidden">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Better Days
        </h1>
        <UserMenu />
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
        <DashboardSkeleton />
      ) : dashboard.isError ? (
        <QueryError
          message="We could not load your dashboard."
          onRetry={() => void dashboard.refetch()}
          isRetrying={dashboard.isFetching}
        />
      ) : !dashboard.data.setupComplete || !dashboard.data.stats ? (
        <RecoverySetupForm />
      ) : (
        <>
          <CheckInPrompt />

          <StatCards stats={dashboard.data.stats} />

          <section aria-label="Quick actions" className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 md:flex-row">
              <Button
                render={<Link href="/checkins" />}
                nativeButton={false}
                size="lg"
                className="w-full rounded-full md:flex-1"
              >
                <NotebookPen aria-hidden className="size-5" />
                Daily Check-in
              </Button>
              <Button
                render={<Link href="/urges/new" />}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="w-full rounded-full border-primary text-primary md:flex-1"
              >
                <TriangleAlert aria-hidden className="size-5" />
                Log an Urge
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Had a setback?{" "}
              <Link
                href="/relapses/new"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Log it here
              </Link>{" "}
              — progress is not erased.
            </p>
          </section>

          {/* Below the quick actions: celebrating progress must not push the
              things someone came here to *do* off the first screen. */}
          {dashboard.data.milestones ? (
            <MilestoneBand summary={dashboard.data.milestones} />
          ) : null}

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
