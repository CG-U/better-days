"use client";

import { BookOpen, Moon, Sun } from "lucide-react";
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
} from "@/features/checkins/hooks/use-local-date";
import { JournalComposer } from "@/features/journal/components/journal-composer";
import { JournalList } from "@/features/journal/components/journal-list";
import { cn } from "@/lib/utils";

/**
 * Journal sits beside the two check-in periods rather than in the nav: it is
 * the same daily habit, written longhand. Morning and Evening record a day;
 * Journal is the one tab with nothing to fill in and nothing to score.
 */
const TABS = [
  { value: "morning", label: "Morning", icon: Sun },
  { value: "evening", label: "Evening", icon: Moon },
  { value: "journal", label: "Journal", icon: BookOpen },
] as const;

type Tab = (typeof TABS)[number]["value"];

const SUBTITLES: Record<Tab, string> = {
  morning: "How are you feeling today?",
  evening: "How are you feeling today?",
  journal: "Somewhere to put the things that don't fit in a form.",
};

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
  const [tab, setTab] = useState<Tab>(getLocalPeriod);
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({
    morning: null,
    evening: null,
    journal: null,
  });

  // Roving focus: arrow keys move between tabs and activate them.
  function onTabKeyDown(event: React.KeyboardEvent) {
    const direction =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (direction === 0) return;
    event.preventDefault();
    const index = TABS.findIndex((item) => item.value === tab);
    const next = TABS[(index + direction + TABS.length) % TABS.length].value;
    setTab(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-5 md:p-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center">
        <BackLink href="/dashboard" label="Back to dashboard" />
        <h1 className="text-center font-heading text-2xl font-bold text-primary">
          Daily
        </h1>
        <span aria-hidden className="size-12" />
      </header>
      <p className="text-center text-muted-foreground">{SUBTITLES[tab]}</p>

      <div
        role="tablist"
        aria-label="Daily entry"
        onKeyDown={onTabKeyDown}
        className="grid grid-cols-3 gap-2 rounded-full bg-muted p-1"
      >
        {TABS.map((item) => {
          const selected = tab === item.value;
          return (
            <button
              key={item.value}
              ref={(node) => {
                tabRefs.current[item.value] = node;
              }}
              id={`checkin-tab-${item.value}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`checkin-panel-${item.value}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(item.value)}
              className={cn(
                "focus-ring flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors duration-200 ease-in-out",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon aria-hidden className="size-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        id={`checkin-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`checkin-tab-${tab}`}
        tabIndex={0}
        className="focus-ring rounded-2xl"
      >
        {tab === "journal" ? (
          <div className="flex flex-col gap-6">
            <JournalComposer />
            <JournalList />
          </div>
        ) : date === null || day.isPending ? (
          <CheckInSkeleton />
        ) : day.isError ? (
          <QueryError
            message="We could not load today's check-in."
            onRetry={() => void day.refetch()}
            isRetrying={day.isFetching}
          />
        ) : tab === "morning" ? (
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
