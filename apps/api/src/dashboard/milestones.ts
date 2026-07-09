import { MILESTONES } from '@better-days/shared';
import type { Milestone, MilestonesSummary } from '@better-days/shared';
import {
  computeCleanRuns,
  utcDayNumberToDateString,
  type CleanRun,
} from './recovery-stats';

/**
 * The calendar day a run first hit `days` clean days, or null if it never did.
 * Day 1 of a run is its start day, so the Nth day is `startDay + N - 1`.
 */
function reachedOn(runs: CleanRun[], days: number): string | null {
  for (const run of runs) {
    if (run.length >= days) {
      return utcDayNumberToDateString(run.startDay + days - 1);
    }
  }
  return null;
}

/**
 * The milestone ladder for one user.
 *
 * Achievement is measured against the clean runs themselves, so a milestone
 * once reached stays reached — a later setback shortens the *current* streak
 * but cannot take back a day that already happened. The next rung, by contrast,
 * is measured from the current streak, so there is always something within
 * reach rather than an unreachable number mocking a fresh start.
 */
export function computeMilestones(
  startDay: number,
  today: number,
  relapseDayNumbers: number[],
  currentStreakDays: number,
): MilestonesSummary {
  // Runs are oldest-first, so the first one long enough is the earliest.
  const runs = computeCleanRuns(startDay, today, relapseDayNumbers);

  const milestones: Milestone[] = MILESTONES.map((milestone) => {
    const achievedOn = reachedOn(runs, milestone.days);
    return {
      days: milestone.days,
      label: milestone.label,
      blurb: milestone.blurb,
      achieved: achievedOn !== null,
      achievedOn,
    };
  });

  const upcoming = MILESTONES.find(
    (milestone) => milestone.days > currentStreakDays,
  );

  return {
    milestones,
    next: upcoming
      ? {
          days: upcoming.days,
          label: upcoming.label,
          daysRemaining: upcoming.days - currentStreakDays,
        }
      : null,
  };
}
