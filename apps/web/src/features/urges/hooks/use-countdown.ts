"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Countdown {
  /** Whole seconds left, never negative. */
  remaining: number;
  isDone: boolean;
  /** Push the finish line back — "give it a few more minutes". */
  extend: (seconds: number) => void;
}

/**
 * A countdown anchored to a wall-clock deadline rather than a decrementing
 * counter. Background tabs throttle `setInterval` to roughly once a minute, and
 * a phone set face-down mid-urge is exactly the case this timer exists for — so
 * every tick re-reads the clock instead of trusting how often it was called.
 *
 * Starts on mount and runs to zero; there is deliberately no pause.
 */
export function useCountdown(totalSeconds: number): Countdown {
  const [remaining, setRemaining] = useState(totalSeconds);
  // Set on mount, not during render: the server would stamp a different clock
  // than the client and the first paint would disagree with itself.
  const deadlineRef = useRef<number | null>(null);

  useEffect(() => {
    deadlineRef.current ??= Date.now() + totalSeconds * 1000;

    const id = setInterval(() => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;
      setRemaining(Math.max(0, Math.round((deadline - Date.now()) / 1000)));
    }, 250);

    return () => clearInterval(id);
  }, [totalSeconds]);

  const extend = useCallback((seconds: number) => {
    deadlineRef.current = (deadlineRef.current ?? Date.now()) + seconds * 1000;
    setRemaining((current) => current + seconds);
  }, []);

  return { remaining, isDone: remaining === 0, extend };
}

/** `05:00` */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
