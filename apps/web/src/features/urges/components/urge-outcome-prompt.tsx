"use client";

import { Check, HeartHandshake } from "lucide-react";
import { FormError } from "@/components/form-error";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useResolveUrge } from "../hooks/use-urges";

/**
 * "How did it end?" — asked on the ride-it-out screen, and again in the history
 * list for urges the user never came back to.
 *
 * Neither answer is the wrong answer. "I gambled" is phrased as a fact the user
 * is telling us, not a confession, and it is styled with the same weight as the
 * other choice: an outline button, never a red one.
 */
export function UrgeOutcomePrompt({
  urgeId,
  compact = false,
  onPassed,
  className,
}: {
  urgeId: string;
  /** Inline variant for the history list. */
  compact?: boolean;
  /** The `gambled` path always routes to the setback form; `passed` varies. */
  onPassed?: () => void;
  className?: string;
}) {
  const resolve = useResolveUrge(urgeId);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className={cn("flex gap-3", compact ? "flex-row" : "flex-col")}>
        <Button
          size={compact ? "default" : "lg"}
          className={cn("rounded-full", !compact && "w-full")}
          disabled={resolve.isPending}
          onClick={() =>
            resolve.mutate({ outcome: "passed" }, { onSuccess: onPassed })
          }
        >
          <Check aria-hidden className="size-5" />
          It passed
        </Button>

        <Button
          variant="outline"
          size={compact ? "default" : "lg"}
          className={cn("rounded-full", !compact && "w-full")}
          disabled={resolve.isPending}
          onClick={() => resolve.mutate({ outcome: "gambled" })}
        >
          <HeartHandshake aria-hidden className="size-5" />
          I gambled
        </Button>
      </div>

      <FormError message={resolve.error?.message} />
    </div>
  );
}
