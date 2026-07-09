"use client";

import { Sunrise } from "lucide-react";
import { QueryError } from "@/components/query-error";
import { Skeleton } from "@/components/ui/skeleton";
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
    return (
      <div className="space-y-3" aria-hidden>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (relapses.isError) {
    return (
      <QueryError
        message="We could not load your entries."
        onRetry={() => void relapses.refetch()}
        isRetrying={relapses.isFetching}
      />
    );
  }

  if (relapses.data.relapses.length === 0) {
    return (
      <div className="flex items-center gap-4 rounded-2xl bg-muted/60 p-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary-container/50 text-on-secondary-container">
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
          className="rounded-2xl border border-border/60 bg-card p-5 shadow-card"
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
