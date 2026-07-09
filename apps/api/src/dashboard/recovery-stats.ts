// Pure recovery-day math, shared by the dashboard and analytics services.
// All values are UTC day numbers (days since the Unix epoch).

export const MS_PER_DAY = 86_400_000;

export function toUtcDayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      MS_PER_DAY,
  );
}

export function utcDayNumberToDateString(day: number): string {
  return new Date(day * MS_PER_DAY).toISOString().slice(0, 10);
}

export interface StreakResult {
  currentStreakDays: number;
  longestStreakDays: number;
}

/** An unbroken stretch of clean days, both ends inclusive. */
export interface CleanRun {
  startDay: number;
  endDay: number;
  /** Always >= 1; empty gaps are never returned. */
  length: number;
}

/**
 * Every unbroken clean stretch between the recovery start and today, oldest
 * first.
 *
 * A relapse day is not a clean day, so it splits the timeline: the run before
 * it ends the day prior, the next opens the day after. Back-to-back relapses
 * simply yield no run between them, and a start date in the future yields none
 * at all.
 *
 * This is the single source of the day arithmetic — `computeStreaks` and the
 * milestone ladder both read it, so streak semantics can only change here.
 */
export function computeCleanRuns(
  startDay: number,
  today: number,
  relapseDayNumbers: number[],
): CleanRun[] {
  if (today < startDay) return [];

  // Unique relapse days within the recovery window, oldest first.
  const relapseDays = [
    ...new Set(
      relapseDayNumbers.filter((day) => day >= startDay && day <= today),
    ),
  ].sort((a, b) => a - b);

  const runs: CleanRun[] = [];
  const push = (from: number, to: number) => {
    if (to >= from) {
      runs.push({ startDay: from, endDay: to, length: to - from + 1 });
    }
  };

  let openedAt = startDay;
  for (const relapseDay of relapseDays) {
    push(openedAt, relapseDay - 1);
    openedAt = relapseDay + 1;
  }
  push(openedAt, today);

  return runs;
}

/**
 * Streak semantics:
 * - The recovery start day counts as day 1, so with no relapses the current
 *   streak is inclusive of both endpoints.
 * - A relapse day is not a streak day; the streak restarts the day after
 *   (a relapse today means a current streak of 0 — the UI keeps the tone
 *   encouraging, the math stays honest).
 * - Longest streak is the longest clean run between start, relapses, and
 *   today.
 */
export function computeStreaks(
  startDay: number,
  today: number,
  relapseDayNumbers: number[],
): StreakResult {
  const runs = computeCleanRuns(startDay, today, relapseDayNumbers);

  // The current streak is live only if the newest run reaches today — a relapse
  // today closes every run before it.
  const newest = runs.at(-1);
  const currentStreakDays = newest?.endDay === today ? newest.length : 0;

  return {
    currentStreakDays,
    longestStreakDays: Math.max(0, ...runs.map((run) => run.length)),
  };
}
