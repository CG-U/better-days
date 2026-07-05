"use client";

import { HeartHandshake } from "lucide-react";
import { useUrges } from "../hooks/use-urges";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function UrgeList() {
  const urges = useUrges();

  if (urges.isPending) {
    return <p className="text-muted-foreground">Loading your entries...</p>;
  }

  if (urges.isError) {
    return (
      <p className="text-muted-foreground">
        We could not load your entries. Please refresh to try again.
      </p>
    );
  }

  if (urges.data.urges.length === 0) {
    return (
      <div className="flex items-center gap-4 rounded-2xl bg-muted/60 p-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-container/40 text-primary">
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
        <li
          key={urge.id}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold">
              Intensity {urge.intensity}/10{" "}
              <span className="ml-1 rounded-full bg-secondary-container/60 px-3 py-1 text-xs font-medium text-on-secondary-container">
                {urge.trigger}
              </span>
            </p>
            <p className="shrink-0 text-sm text-muted-foreground">
              {dateFormatter.format(new Date(urge.occurredAt))}
            </p>
          </div>
          {urge.notes ? (
            <p className="mt-2 text-sm text-muted-foreground">{urge.notes}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
