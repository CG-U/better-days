import { z } from 'zod';
import type { MilestonesSummary } from './milestones';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const RecoverySetupSchema = z.object({
  recoveryStartDate: z
    .string()
    .regex(DATE_ONLY_REGEX, 'Enter a valid date')
    .refine(
      (value) => value <= new Date().toISOString().slice(0, 10),
      'Start date cannot be in the future',
    ),
  dailySpend: z
    .number({ invalid_type_error: 'Enter an amount' })
    .nonnegative('Amount cannot be negative')
    .max(100_000, 'Enter a smaller amount'),
});

export type RecoverySetupInput = z.infer<typeof RecoverySetupSchema>;

export interface RecoveryProfile {
  recoveryStartDate: string; // YYYY-MM-DD
  dailySpend: number; // dollars
}

export interface RecoveryProfileResponse {
  profile: RecoveryProfile;
}

export interface DashboardStats {
  currentStreakDays: number;
  longestStreakDays: number;
  moneySavedCents: number;
  recoveryDays: number;
}

export type RecentActivityType = 'urge' | 'relapse' | 'checkin';

export interface RecentActivityItem {
  id: string;
  type: RecentActivityType;
  label: string;
  occurredAt: string; // ISO datetime
}

export interface DashboardResponse {
  setupComplete: boolean;
  profile: RecoveryProfile | null;
  stats: DashboardStats | null;
  /** Null until the recovery profile is set, like `stats`. */
  milestones: MilestonesSummary | null;
  recentActivity: RecentActivityItem[];
}
