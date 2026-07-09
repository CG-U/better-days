/**
 * The milestone ladder. 180 sits between 90 and 365 on purpose: nine months
 * with nothing to reach for is a long time to keep going on faith.
 */
export const MILESTONES = [
  { days: 1, label: 'First day', blurb: 'The hardest one to start.' },
  { days: 7, label: 'One week', blurb: 'A full week of choosing differently.' },
  { days: 30, label: 'One month', blurb: 'This is a habit now, not an effort.' },
  { days: 90, label: 'Three months', blurb: 'The season turned with you.' },
  { days: 180, label: 'Six months', blurb: 'Half a year of better days.' },
  { days: 365, label: 'One year', blurb: 'A whole year. Look how far.' },
] as const;

export type MilestoneDays = (typeof MILESTONES)[number]['days'];

export interface Milestone {
  days: number;
  label: string;
  blurb: string;
  /**
   * Earned against the *longest* streak, never the current one. Reaching thirty
   * clean days is a thing that happened; a later setback does not un-happen it.
   */
  achieved: boolean;
  /** YYYY-MM-DD the milestone was first reached, or null. */
  achievedOn: string | null;
}

/** The next rung, measured from the *current* streak — always something close. */
export interface NextMilestone {
  days: number;
  label: string;
  daysRemaining: number;
}

export interface MilestonesSummary {
  milestones: Milestone[];
  next: NextMilestone | null;
}
