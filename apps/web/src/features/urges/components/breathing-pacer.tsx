"use client";

import type { BreathingPhase } from "../hooks/use-breathing-phase";

/** Contracted on the exhale, full size on the inhale and the hold. */
const SCALE: Record<BreathingPhase["key"], number> = {
  inhale: 1,
  hold: 1,
  exhale: 0.7,
};

/**
 * A circle that breathes with the user. The transition duration is the phase's
 * own length, so the ring is still growing for exactly as long as they should
 * still be inhaling.
 *
 * Under `prefers-reduced-motion` the global reset collapses the transition and
 * the circle simply snaps — which is why the phase is also written out in text.
 */
export function BreathingPacer({ phase }: { phase: BreathingPhase }) {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex size-56 items-center justify-center sm:size-64">
        <div
          aria-hidden
          className="flex size-full items-center justify-center rounded-full bg-primary-container/30 transition-transform ease-in-out"
          style={{
            transform: `scale(${SCALE[phase.key]})`,
            transitionDuration: `${phase.seconds}s`,
          }}
        >
          <div className="size-2/3 rounded-full bg-primary-container/40" />
        </div>
      </div>

      <p
        aria-live="polite"
        className="font-heading text-2xl font-semibold text-primary"
      >
        {phase.label}
      </p>
    </div>
  );
}
