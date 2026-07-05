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
  // Unique relapse days within the recovery window, oldest first.
  const relapseDays = [
    ...new Set(
      relapseDayNumbers.filter((day) => day >= startDay && day <= today),
    ),
  ].sort((a, b) => a - b);

  if (relapseDays.length === 0) {
    const streak = Math.max(0, today - startDay) + 1;
    return { currentStreakDays: streak, longestStreakDays: streak };
  }

  const currentStreakDays = today - relapseDays[relapseDays.length - 1];

  const segments = [relapseDays[0] - startDay];
  for (let i = 1; i < relapseDays.length; i++) {
    segments.push(relapseDays[i] - relapseDays[i - 1] - 1);
  }
  segments.push(currentStreakDays);

  return {
    currentStreakDays,
    longestStreakDays: Math.max(0, ...segments),
  };
}
