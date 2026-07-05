import { z } from 'zod';

// Minutes east of UTC (i.e. -new Date().getTimezoneOffset()), so the API can
// bucket urges into the user's local hours and weekdays.
export const TzOffsetSchema = z.coerce
  .number()
  .int()
  .min(-840)
  .max(840)
  .default(0);

export interface TriggerCount {
  trigger: string;
  count: number;
}

export interface SavingsPoint {
  date: string; // YYYY-MM-DD
  savedCents: number; // cumulative, clamped >= 0
}

export type TimelineEventType = 'start' | 'relapse' | 'today';

export interface TimelineEvent {
  date: string; // YYYY-MM-DD
  type: TimelineEventType;
  label: string;
}

export interface AnalyticsResponse {
  setupComplete: boolean;
  longestStreakDays: number;
  totalUrges: number;
  /** Index 0 = midnight … 23 = 11pm, in the user's timezone. */
  urgesByHour: number[];
  /** Index 0 = Sunday … 6 = Saturday, in the user's timezone. */
  urgesByWeekday: number[];
  /** Urge + relapse triggers combined, most frequent first. */
  topTriggers: TriggerCount[];
  /** Cumulative savings since the recovery start (sampled points). */
  moneySavedOverTime: SavingsPoint[];
  /** Chronological recovery events: start, relapses, today. */
  timeline: TimelineEvent[];
}
