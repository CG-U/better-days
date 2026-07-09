"use client";

import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Error state for a failed query. Always offers a way forward — telling someone
 * in recovery to "refresh the page" is a dead end we can avoid.
 */
export function QueryError({
  message,
  onRetry,
  isRetrying = false,
}: {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-2xl bg-muted/60 p-6 text-center"
    >
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button
        variant="outline"
        size="lg"
        className="rounded-full"
        onClick={onRetry}
        disabled={isRetrying}
      >
        <RotateCw aria-hidden className={isRetrying ? "animate-spin" : ""} />
        {isRetrying ? "Retrying..." : "Try again"}
      </Button>
    </div>
  );
}
