"use client";

import Link from "next/link";
import { Award, Brain, Heart, Lightbulb, PiggyBank } from "lucide-react";
import { QueryError } from "@/components/query-error";
import { SectionCard } from "@/components/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HourChart,
  SavingsChart,
  WeekdayChart,
} from "@/features/analytics/components/charts";
import { useAnalytics } from "@/features/analytics/hooks/use-analytics";

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
      <Skeleton className="h-36 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
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

  return (
    <main className="mx-auto flex w-full max-w-[1040px] flex-col gap-6 p-5 md:p-10">
      <header className="space-y-1">
        <h1 className="font-heading text-headline-lg">Your Journey</h1>
        <p className="text-muted-foreground">
          Reflecting on your growth and resilience.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        {!data.setupComplete ? (
          <p className="rounded-2xl bg-muted/60 p-6 text-muted-foreground lg:col-span-2">
            Set up your recovery profile on the{" "}
            <Link href="/dashboard" className="font-medium text-primary">
              dashboard
            </Link>{" "}
            to unlock streaks and savings trends.
          </p>
        ) : (
          <>
            <SectionCard className="border-transparent bg-primary-container/25">
              <div className="flex items-center justify-between">
                <SectionLabel tone="primary">Growth milestone</SectionLabel>
                <Award aria-hidden className="size-5 text-primary" />
              </div>
              <h2 className="mt-3 text-xl font-semibold">Longest streak</h2>
              <p className="font-heading">
                <span className="text-stat-display text-primary">
                  {data.longestStreakDays}
                </span>{" "}
                <span className="text-lg text-muted-foreground">
                  {data.longestStreakDays === 1 ? "Day" : "Days"}
                </span>
              </p>
            </SectionCard>

            <SectionCard>
              <div className="flex items-center justify-between">
                <SectionLabel tone="tertiary">
                  Money saved over time
                </SectionLabel>
                <PiggyBank aria-hidden className="size-5 text-milestone" />
              </div>
              <p className="mt-2 mb-4 text-muted-foreground">
                Total: {moneyFormatter.format(totalSaved / 100)} saved
              </p>
              <SavingsChart points={data.moneySavedOverTime} />
            </SectionCard>
          </>
        )}

        <SectionCard>
          <div className="flex items-center justify-between">
            <SectionLabel tone="secondary">Self awareness</SectionLabel>
            <Brain aria-hidden className="size-5 text-secondary" />
          </div>
          <h2 className="mt-3 mb-4 text-xl font-semibold">
            Most common triggers
          </h2>
          {data.topTriggers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No triggers recorded yet — they will appear as you log urges and
              setbacks.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
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

        <SectionCard>
          <h2 className="mb-4 text-xl font-semibold">Urges by weekday</h2>
          {hasUrges ? (
            <>
              <WeekdayChart counts={data.urgesByWeekday} />
              {busiestWeekday !== null && (
                <div className="mt-4 flex items-start gap-3 rounded-xl bg-secondary-container/40 p-4">
                  <Lightbulb
                    aria-hidden
                    className="mt-0.5 size-5 shrink-0 text-secondary"
                  />
                  <p className="text-sm">
                    {WEEKDAY_NAMES[busiestWeekday]} seem to be your most
                    challenging day. A little extra kindness and planning there
                    can go a long way.
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Log urges to see which days tend to be hardest.
            </p>
          )}
        </SectionCard>

        <SectionCard>
          <h2 className="mb-4 text-xl font-semibold">Urges by hour</h2>
          {hasUrges ? (
            <HourChart counts={data.urgesByHour} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Log urges to see what times of day they tend to show up.
            </p>
          )}
        </SectionCard>

        {data.timeline.length > 0 && (
          <SectionCard className="lg:col-span-2">
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
      </div>

      <figure className="flex flex-col items-center gap-3 py-6 text-center">
        <Heart aria-hidden className="size-8 text-primary" />
        <blockquote className="max-w-xs text-muted-foreground">
          Every day is a step toward a brighter, healthier future.
        </blockquote>
      </figure>
    </main>
  );
}
