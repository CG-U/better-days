"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A 4–4–6 cycle: a longer exhale than inhale nudges the parasympathetic nervous
 * system, which is the whole point of pacing someone's breath through a craving.
 */
const CYCLE = [
  { key: "inhale", label: "Breathe in", seconds: 4 },
  { key: "hold", label: "Hold", seconds: 4 },
  { key: "exhale", label: "Breathe out", seconds: 6 },
] as const;

const CYCLE_SECONDS = CYCLE.reduce((total, phase) => total + phase.seconds, 0);

export type BreathingPhase = (typeof CYCLE)[number];

function phaseAt(elapsedSeconds: number): BreathingPhase {
  let offset = elapsedSeconds % CYCLE_SECONDS;
  for (const phase of CYCLE) {
    if (offset < phase.seconds) return phase;
    offset -= phase.seconds;
  }
  return CYCLE[0];
}

/**
 * Drives the breathing pacer. The phase is *state*, not a CSS animation, so the
 * written cue ("Breathe out") stays correct for users who have reduced motion
 * enabled and never see the circle move.
 */
export function useBreathingPhase(active: boolean): BreathingPhase {
  const [phase, setPhase] = useState<BreathingPhase>(CYCLE[0]);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    startedAtRef.current ??= Date.now();

    const id = setInterval(() => {
      const startedAt = startedAtRef.current;
      if (startedAt === null) return;
      setPhase(phaseAt((Date.now() - startedAt) / 1000));
    }, 200);

    return () => clearInterval(id);
  }, [active]);

  return phase;
}
