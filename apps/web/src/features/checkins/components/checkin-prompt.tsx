"use client";

import { CircleCheck, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { useCheckInDay } from "../hooks/use-checkins";
import {
  getLocalPeriod,
  useLocalDate,
  type Period,
} from "../hooks/use-local-date";

const COPY: Record<
  Period,
  {
    icon: typeof Sun;
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
  }
> = {
  morning: {
    icon: Sun,
    eyebrow: "Good morning",
    title: "Start the day with a check-in",
    body: "A minute of reflection on your mood, sleep, and intention sets the tone for today.",
    cta: "Check in for this morning",
  },
  evening: {
    icon: Moon,
    eyebrow: "Winding down",
    title: "Close the day with a check-in",
    body: "Look back on how today went. Wins count, however small.",
    cta: "Check in for this evening",
  },
};

/**
 * Nudges the user into today's check-in rather than waiting for them to find
 * the button. Renders nothing while loading, on error, or once the current
 * period is already logged — an absent prompt should never read as a failure.
 */
export function CheckInPrompt() {
  const date = useLocalDate();
  const day = useCheckInDay(date);

  if (date === null || day.isPending || day.isError) {
    return null;
  }

  const period = getLocalPeriod();
  const done = day.data[period] !== null;

  if (done) {
    return (
      <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <CircleCheck aria-hidden className="size-4 text-primary" />
        Your {period} check-in is done for today.{" "}
        <Link
          href="/checkins"
          className="focus-ring rounded font-medium text-primary underline-offset-4 hover:underline"
        >
          Update it
        </Link>
      </p>
    );
  }

  const copy = COPY[period];

  return (
    <SectionCard className="border-transparent bg-secondary-container/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
          <copy.icon aria-hidden className="size-6" />
        </span>
        <div className="flex-1 space-y-1">
          <p className="label-caps text-on-secondary-container">
            {copy.eyebrow}
          </p>
          <h2 className="font-heading text-xl font-semibold">{copy.title}</h2>
          <p className="text-sm text-muted-foreground">{copy.body}</p>
        </div>
        <Button
          render={<Link href="/checkins" />}
          nativeButton={false}
          size="lg"
          className="shrink-0 rounded-full"
        >
          {copy.cta}
        </Button>
      </div>
    </SectionCard>
  );
}
