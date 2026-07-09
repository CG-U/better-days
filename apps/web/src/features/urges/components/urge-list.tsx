"use client";

import type { Urge, UrgeOutcome } from "@better-days/shared";
import { HeartHandshake } from "lucide-react";
import { QueryError } from "@/components/query-error";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUrges } from "../hooks/use-urges";
import { isWithinOutcomePromptWindow } from "../outcome-window";
import { UrgeOutcomePrompt } from "./urge-outcome-prompt";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/**
 * `gambled` wears the warm `warning` tone, never `destructive` red — a setback
 * is information, not an error (DESIGN.md § Status tones).
 */
const OUTCOME_BADGE: Record<
  Exclude<UrgeOutcome, "unresolved">,
  { label: string; className: string }
> = {
  passed: {
    label: "Passed",
    className: "bg-primary-container/50 text-on-primary-container",
  },
  gambled: {
    label: "Gambled",
    className: "bg-warning-container text-on-warning-container",
  },
};

/**
 * `now` is threaded in rather than read from the clock here: `Date.now()` is
 * impure and cannot be called during render. The query's `dataUpdatedAt` is the
 * moment this list was fetched, which is a truthful and stable "now".
 */
function UrgeListItem({ urge, now }: { urge: Urge; now: number }) {
  const badge =
    urge.outcome === "unresolved" ? null : OUTCOME_BADGE[urge.outcome];
  const askOutcome =
    urge.outcome === "unresolved" &&
    isWithinOutcomePromptWindow(urge.occurredAt, now);

  return (
    <li className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold">
          Intensity {urge.intensity}/10{" "}
          <span className="ml-1 rounded-full bg-secondary-container/60 px-3 py-1 text-xs font-medium text-on-secondary-container">
            {urge.trigger}
          </span>
          {badge ? (
            <span
              className={cn(
                "ml-1 rounded-full px-3 py-1 text-xs font-medium",
                badge.className,
              )}
            >
              {badge.label}
            </span>
          ) : null}
        </p>
        <p className="shrink-0 text-sm text-muted-foreground">
          {dateFormatter.format(new Date(urge.occurredAt))}
        </p>
      </div>

      {urge.notes ? (
        <p className="mt-2 text-sm text-muted-foreground">{urge.notes}</p>
      ) : null}

      {askOutcome ? (
        <div className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">How did this one end?</p>
          <UrgeOutcomePrompt urgeId={urge.id} compact />
        </div>
      ) : null}
    </li>
  );
}

export function UrgeList() {
  const urges = useUrges();

  if (urges.isPending) {
    return (
      <div className="space-y-3" aria-hidden>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (urges.isError) {
    return (
      <QueryError
        message="We could not load your entries."
        onRetry={() => void urges.refetch()}
        isRetrying={urges.isFetching}
      />
    );
  }

  if (urges.data.urges.length === 0) {
    return (
      <div className="flex items-center gap-4 rounded-2xl bg-muted/60 p-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-container/40 text-on-primary-container">
          <HeartHandshake aria-hidden className="size-5" />
        </span>
        <p className="text-sm text-muted-foreground">
          No urges logged yet. When one shows up, tracking it here is a strong
          first response.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {urges.data.urges.map((urge) => (
        <UrgeListItem key={urge.id} urge={urge} now={urges.dataUpdatedAt} />
      ))}
    </ul>
  );
}
