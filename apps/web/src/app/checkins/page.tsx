"use client";

import { Moon, Sun } from "lucide-react";
import { useRef, useState } from "react";
import { BackLink } from "@/components/back-link";
import { QueryError } from "@/components/query-error";
import { Skeleton } from "@/components/ui/skeleton";
import { EveningForm } from "@/features/checkins/components/evening-form";
import { MorningForm } from "@/features/checkins/components/morning-form";
import { useCheckInDay } from "@/features/checkins/hooks/use-checkins";
import {
  getLocalPeriod,
  useLocalDate,
  type Period,
} from "@/features/checkins/hooks/use-local-date";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "morning", label: "Morning", icon: Sun },
  { value: "evening", label: "Evening", icon: Moon },
] as const;

function CheckInSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-card"
        >
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  );
}

export default function CheckInsPage() {
  const date = useLocalDate();
  const day = useCheckInDay(date);
  const [period, setPeriod] = useState<Period>(getLocalPeriod);
  const tabRefs = useRef<Record<Period, HTMLButtonElement | null>>({
    morning: null,
    evening: null,
  });

  // Roving focus: arrow keys move between tabs and activate them.
  function onTabKeyDown(event: React.KeyboardEvent) {
    const direction =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (direction === 0) return;
    event.preventDefault();
    const index = TABS.findIndex((tab) => tab.value === period);
    const next = TABS[(index + direction + TABS.length) % TABS.length].value;
    setPeriod(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-5 md:p-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center">
        <BackLink href="/dashboard" label="Back to dashboard" />
        <h1 className="text-center font-heading text-2xl font-bold text-primary">
          Daily Check-in
        </h1>
        <span aria-hidden className="size-12" />
      </header>
      <p className="text-center text-muted-foreground">
        How are you feeling today?
      </p>

      <div
        role="tablist"
        aria-label="Check-in period"
        onKeyDown={onTabKeyDown}
        className="grid grid-cols-2 gap-2 rounded-full bg-muted p-1"
      >
        {TABS.map((tab) => {
          const selected = period === tab.value;
          return (
            <button
              key={tab.value}
              ref={(node) => {
                tabRefs.current[tab.value] = node;
              }}
              id={`checkin-tab-${tab.value}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`checkin-panel-${tab.value}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setPeriod(tab.value)}
              className={cn(
                "focus-ring flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors duration-200 ease-in-out",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <tab.icon aria-hidden className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id={`checkin-panel-${period}`}
        role="tabpanel"
        aria-labelledby={`checkin-tab-${period}`}
        tabIndex={0}
        className="focus-ring rounded-2xl"
      >
        {date === null || day.isPending ? (
          <CheckInSkeleton />
        ) : day.isError ? (
          <QueryError
            message="We could not load today's check-in."
            onRetry={() => void day.refetch()}
            isRetrying={day.isFetching}
          />
        ) : period === "morning" ? (
          <MorningForm
            key={day.data.morning?.id ?? "morning-new"}
            date={date}
            existing={day.data.morning}
          />
        ) : (
          <EveningForm
            key={day.data.evening?.id ?? "evening-new"}
            date={date}
            existing={day.data.evening}
          />
        )}
      </div>
    </main>
  );
}
