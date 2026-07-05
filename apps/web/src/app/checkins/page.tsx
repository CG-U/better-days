"use client";

import { ArrowLeft, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { EveningForm } from "@/features/checkins/components/evening-form";
import { MorningForm } from "@/features/checkins/components/morning-form";
import { useCheckInDay } from "@/features/checkins/hooks/use-checkins";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

function getLocalDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// Client-only: the check-in day must be the user's local day, which the
// server (possibly in another timezone) cannot know.
function useLocalDate(): string | null {
  return useSyncExternalStore(emptySubscribe, getLocalDate, () => null);
}

type Period = "morning" | "evening";

export default function CheckInsPage() {
  const date = useLocalDate();
  const day = useCheckInDay(date);
  const [period, setPeriod] = useState<Period>(() =>
    new Date().getHours() < 17 ? "morning" : "evening",
  );

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 p-5 md:p-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center">
        <Link
          href="/dashboard"
          aria-label="Back to dashboard"
          className="rounded-full p-2 hover:bg-muted"
        >
          <ArrowLeft aria-hidden className="size-6" />
        </Link>
        <h1 className="text-center font-heading text-2xl font-bold text-primary">
          Daily Check-in
        </h1>
        <span aria-hidden className="size-10" />
      </header>
      <p className="text-center text-muted-foreground">
        How are you feeling today?
      </p>

      <div
        role="tablist"
        aria-label="Check-in period"
        className="grid grid-cols-2 gap-2 rounded-full bg-muted p-1"
      >
        {(
          [
            { value: "morning", label: "Morning", icon: Sun },
            { value: "evening", label: "Evening", icon: Moon },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={period === tab.value}
            onClick={() => setPeriod(tab.value)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors",
              period === tab.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <tab.icon aria-hidden className="size-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {date === null || day.isPending ? (
        <p className="text-center text-muted-foreground">
          Loading today&apos;s check-in...
        </p>
      ) : day.isError ? (
        <p className="text-center text-muted-foreground">
          We could not load today&apos;s check-in. Please refresh to try again.
        </p>
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
    </main>
  );
}
