"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useDelayedFlag } from "@/hooks/use-delayed-flag";

/**
 * A calm, app-wide "still working" pill for requests that run long — most often
 * the first one after the API has idled and has to cold-start (measured at ~30s
 * in production). Without it, a slow login looks broken and people re-tap or
 * leave.
 *
 * It watches TanStack Query's global in-flight count, so a slow login (a
 * mutation), a slow dashboard load (a query), and everything else are all
 * covered by this one mount — no per-form wiring.
 *
 * The copy names no cause on purpose: the wait might be a cold start, a waking
 * database, or slow Wi-Fi, and "the server was asleep" would be both
 * developer-facing and, half the time, untrue.
 */
const SLOW_AFTER_MS = 5000;

export function SlowRequestIndicator() {
  const active = useIsFetching() + useIsMutating() > 0;
  const show = useDelayedFlag(active, SLOW_AFTER_MS);

  if (!show) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-card">
        <Loader2 aria-hidden className="size-4 animate-spin" />
        Still working — this can take a moment.
      </div>
    </div>
  );
}
