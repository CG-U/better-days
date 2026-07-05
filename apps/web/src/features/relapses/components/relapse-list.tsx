"use client";

import { Sunrise } from "lucide-react";
import { useRelapses } from "../hooks/use-relapses";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function RelapseList() {
  const relapses = useRelapses();

  if (relapses.isPending) {
    return <p className="text-muted-foreground">Loading your entries...</p>;
  }

  if (relapses.isError) {
    return (
      <p className="text-muted-foreground">
        We could not load your entries. Please refresh to try again.
      </p>
    );
  }

  if (relapses.data.relapses.length === 0) {
    return (
      <div className="flex items-center gap-4 rounded-2xl bg-muted/60 p-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary-container/50 text-secondary">
          <Sunrise aria-hidden className="size-5" />
        </span>
        <p className="text-sm text-muted-foreground">
          No setbacks logged. If one ever happens, recording it here is part of
          moving forward — not a failure.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {relapses.data.relapses.map((relapse) => (
        <li
          key={relapse.id}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold">
              {moneyFormatter.format(relapse.amountSpentCents / 100)}{" "}
              <span className="ml-1 rounded-full bg-secondary-container/60 px-3 py-1 text-xs font-medium text-on-secondary-container">
                {relapse.trigger}
              </span>
            </p>
            <p className="shrink-0 text-sm text-muted-foreground">
              {dateFormatter.format(new Date(relapse.occurredAt))}
            </p>
          </div>
          {relapse.notes ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {relapse.notes}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
