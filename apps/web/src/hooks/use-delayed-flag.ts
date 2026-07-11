"use client";

import { useEffect, useState } from "react";

/**
 * Returns false until `active` has been continuously true for `delayMs`, then
 * true; resets to false the moment `active` goes false. Lets a fast operation
 * stay silent while a slow one earns a message.
 *
 * Timer-based (setTimeout) and React-Compiler-safe: no `Date.now()` in render.
 */
export function useDelayedFlag(active: boolean, delayMs: number): boolean {
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    if (!active) {
      return;
    }

    // The body only schedules; the flag is set asynchronously by the timer and
    // reset in cleanup when `active` goes false (or on unmount). This keeps a
    // synchronous setState out of the effect body, which the React Compiler
    // rejects as a cascading render.
    const id = setTimeout(() => setElapsed(true), delayMs);
    return () => {
      clearTimeout(id);
      setElapsed(false);
    };
  }, [active, delayMs]);

  return elapsed;
}
