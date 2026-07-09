"use client";

import { CheckCircle2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CrisisPanel } from "@/components/crisis-panel";
import { QueryError } from "@/components/query-error";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreathingPhase } from "../hooks/use-breathing-phase";
import { formatDuration, useCountdown } from "../hooks/use-countdown";
import { useUrge } from "../hooks/use-urges";
import { BreathingPacer } from "./breathing-pacer";
import { UrgeOutcomePrompt } from "./urge-outcome-prompt";

/** Long enough for a craving to crest, short enough to feel survivable. */
const RIDE_SECONDS = 5 * 60;
const EXTENSION_SECONDS = 5 * 60;

/**
 * `toolkit` is injected by the page rather than imported: a feature must not
 * reach into another feature's components, so `app/` does the composing.
 */
export function UrgeRide({
  id,
  toolkit,
}: {
  id: string;
  toolkit?: React.ReactNode;
}) {
  const router = useRouter();
  const urge = useUrge(id);
  const { remaining, isDone, extend } = useCountdown(RIDE_SECONDS);
  const phase = useBreathingPhase(!isDone);

  if (urge.isPending) {
    return <Skeleton className="h-96 rounded-2xl" aria-hidden />;
  }

  if (urge.isError) {
    return (
      <QueryError
        message="We could not load that entry."
        onRetry={() => void urge.refetch()}
        isRetrying={urge.isFetching}
      />
    );
  }

  const { intensity, trigger, outcome } = urge.data.urge;

  // Already answered — nothing left to ask. Deep links and back-button returns
  // land here rather than restarting a timer for an urge that is over.
  if (outcome !== "unresolved") {
    return (
      <SectionCard className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary-container/40 text-on-primary-container">
          <CheckCircle2 aria-hidden className="size-6" />
        </span>
        <p className="font-heading text-xl font-semibold">
          This one is already recorded.
        </p>
        <p className="text-sm text-muted-foreground">
          {outcome === "passed"
            ? "You rode it out. That counts."
            : "You told us how it went, and that honesty is worth something."}
        </p>
        <Button
          render={<Link href="/urges" />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="rounded-full"
        >
          Back to your urges
        </Button>
      </SectionCard>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-center text-muted-foreground">
        Intensity {intensity}/10
        <span className="mx-2 text-border">·</span>
        {trigger}
      </p>

      {isDone ? (
        <SectionCard className="flex flex-col gap-5 text-center">
          <div className="space-y-2">
            <p className="font-heading text-headline-lg text-primary">
              Five minutes down.
            </p>
            <p className="text-muted-foreground">
              However this went, you gave it time instead of acting on it. How
              did it end?
            </p>
          </div>

          <UrgeOutcomePrompt urgeId={id} onPassed={() => router.push("/urges")} />

          <Button
            variant="ghost"
            size="lg"
            className="rounded-full"
            onClick={() => extend(EXTENSION_SECONDS)}
          >
            <Plus aria-hidden className="size-5" />
            Give it five more minutes
          </Button>
        </SectionCard>
      ) : (
        <SectionCard className="flex flex-col items-center gap-2">
          <BreathingPacer phase={phase} />

          <p
            role="timer"
            aria-live="off"
            className="font-heading text-stat-display tabular-nums text-foreground"
          >
            {formatDuration(remaining)}
          </p>
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            Urges rise and fall like a wave. Most crest and fade within twenty
            minutes — you do not have to do anything but wait.
          </p>
        </SectionCard>
      )}

      {/* Only while the timer runs: once we are asking how it ended, offering
          coping strategies is offering them too late. */}
      {!isDone ? toolkit : null}

      <CrisisPanel />

      {!isDone ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">Ended early?</p>
          <UrgeOutcomePrompt
            urgeId={id}
            compact
            onPassed={() => router.push("/urges")}
          />
        </div>
      ) : null}
    </div>
  );
}
