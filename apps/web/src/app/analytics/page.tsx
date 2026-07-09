"use client";

import {
  Award,
  Brain,
  Heart,
  HeartHandshake,
  Lightbulb,
  PiggyBank,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { QueryError } from "@/components/query-error";
import { SectionCard } from "@/components/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HourChart,
  SavingsChart,
  WeekdayChart,
} from "@/features/analytics/components/charts";
import { StatTile } from "@/features/analytics/components/stat-tile";
import { useAnalytics } from "@/features/analytics/hooks/use-analytics";
import { cn } from "@/lib/utils";

const WEEKDAY_NAMES = [
  "Sundays",
  "Mondays",
  "Tuesdays",
  "Wednesdays",
  "Thursdays",
  "Fridays",
  "Saturdays",
];

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const timelineDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function SectionLabel({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "primary" | "secondary" | "tertiary";
}) {
  const toneClass = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
  }[tone];
  return <p className={`label-caps ${toneClass}`}>{children}</p>;
}

function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
      <Skeleton className="h-72 rounded-2xl" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
      <Skeleton className="h-32 rounded-2xl" />
    </div>
  );
}

export default function AnalyticsPage() {
  const analytics = useAnalytics();

  if (analytics.isPending) {
    return (
      <main className="mx-auto w-full max-w-[1040px] p-5 md:p-10">
        <AnalyticsSkeleton />
      </main>
    );
  }

  if (analytics.isError) {
    return (
      <main className="mx-auto w-full max-w-[1040px] p-5 md:p-10">
        <QueryError
          message="We could not load your trends."
          onRetry={() => void analytics.refetch()}
          isRetrying={analytics.isFetching}
        />
      </main>
    );
  }

  const data = analytics.data;
  const hasUrges = data.totalUrges > 0;
  const totalSaved =
    data.moneySavedOverTime[data.moneySavedOverTime.length - 1]?.savedCents ??
    0;
  const busiestWeekday = hasUrges
    ? data.urgesByWeekday.indexOf(Math.max(...data.urgesByWeekday))
    : null;
  const setbacks = data.timeline.filter(
    (event) => event.type === "relapse",
  ).length;

  return (
    <main className="mx-auto flex w-full max-w-[1040px] flex-col gap-6 p-5 md:p-10">
      <header className="space-y-1">
        <h1 className="font-heading text-headline-lg">Your Journey</h1>
        <p className="text-muted-foreground">
          Reflecting on your growth and resilience.
        </p>
      </header>

      {!data.setupComplete && (
        <p className="rounded-2xl bg-muted/60 p-6 text-muted-foreground">
          Set up your recovery profile on the{" "}
          <Link href="/dashboard" className="font-medium text-primary">
            dashboard
          </Link>{" "}
          to unlock streaks and savings trends.
        </p>
      )}

      {/* Summary strip: same-shaped tiles, so the row reads as one unit. The
          streak tile is absent until the profile is set up, so the column count
          follows the tile count and never leaves a hole. */}
      <div
        className={cn(
          "grid gap-6 sm:grid-cols-2",
          data.setupComplete && "lg:grid-cols-3",
        )}
      >
        {data.setupComplete && (
          <StatTile
            eyebrow="Growth milestone"
            title="Longest streak"
            value={data.longestStreakDays}
            unit={data.longestStreakDays === 1 ? "Day" : "Days"}
            icon={Award}
            tone="primary"
          />
        )}
        <StatTile
          eyebrow="Awareness"
          title="Urges noticed"
          value={data.totalUrges}
          icon={Zap}
          tone="secondary"
        />
        <StatTile
          eyebrow="Honesty"
          title="Setbacks logged"
          value={setbacks}
          icon={HeartHandshake}
          tone="milestone"
        />
      </div>

      {data.setupComplete && (
        <SectionCard>
          <div className="flex items-center justify-between">
            <SectionLabel tone="tertiary">Money saved over time</SectionLabel>
            <PiggyBank aria-hidden className="size-5 text-milestone" />
          </div>
          <p className="mt-2 mb-4 text-muted-foreground">
            Total: {moneyFormatter.format(totalSaved / 100)} saved
          </p>
          <SavingsChart points={data.moneySavedOverTime} />
        </SectionCard>
      )}

      {/* Both charts are 200px tall, so the pair stays level at every width. */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard className="flex flex-col">
          <h2 className="mb-4 text-xl font-semibold">Urges by weekday</h2>
          {hasUrges ? (
            <WeekdayChart counts={data.urgesByWeekday} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Log urges to see which days tend to be hardest.
            </p>
          )}
        </SectionCard>

        <SectionCard className="flex flex-col">
          <h2 className="mb-4 text-xl font-semibold">Urges by hour</h2>
          {hasUrges ? (
            <HourChart counts={data.urgesByHour} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Log urges to see what times of day they tend to show up.
            </p>
          )}
        </SectionCard>
      </div>

      {busiestWeekday !== null && (
        <div className="flex items-start gap-3 rounded-2xl bg-secondary-container/40 p-5">
          <Lightbulb
            aria-hidden
            className="mt-0.5 size-5 shrink-0 text-secondary"
          />
          <p className="text-sm">
            {WEEKDAY_NAMES[busiestWeekday]} seem to be your most challenging day.
            A little extra kindness and planning there can go a long way.
          </p>
        </div>
      )}

      <SectionCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-10">
        <div>
          <div className="flex items-center gap-2">
            <Brain aria-hidden className="size-5 text-secondary" />
            <SectionLabel tone="secondary">Self awareness</SectionLabel>
          </div>
          <h2 className="mt-2 text-xl font-semibold">Most common triggers</h2>
        </div>
        {data.topTriggers.length === 0 ? (
          <p className="text-sm text-muted-foreground md:max-w-sm md:text-right">
            No triggers recorded yet — they will appear as you log urges and
            setbacks.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2 md:justify-end">
            {data.topTriggers.map((item, index) => (
              <li
                key={item.trigger}
                className={
                  index === 0
                    ? "rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"
                    : "rounded-full bg-secondary-container/60 px-4 py-2 text-sm text-on-secondary-container"
                }
              >
                {item.trigger} · {item.count}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {data.timeline.length > 0 && (
        <SectionCard>
          <h2 className="mb-4 text-xl font-semibold">Recovery timeline</h2>
          <ol className="space-y-0">
            {data.timeline.map((event, index) => (
              <li
                key={`${event.date}-${index}`}
                className="relative flex gap-4 pb-5 last:pb-0"
              >
                {index < data.timeline.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-4 left-[5px] h-full w-0.5 bg-border"
                  />
                )}
                <span
                  aria-hidden
                  className={`relative mt-1.5 size-3 shrink-0 rounded-full ${
                    event.type === "relapse" ? "bg-warning" : "bg-primary"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium">{event.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {timelineDateFormatter.format(
                      new Date(`${event.date}T00:00:00`),
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>
      )}

      <figure className="flex flex-col items-center gap-3 py-6 text-center">
        <Heart aria-hidden className="size-8 text-primary" />
        <blockquote className="max-w-xs text-muted-foreground">
          Every day is a step toward a brighter, healthier future.
        </blockquote>
      </figure>
    </main>
  );
}
