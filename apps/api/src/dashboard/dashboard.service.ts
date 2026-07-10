import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  DashboardResponse,
  DashboardStats,
  MilestonesSummary,
  RecentActivityItem,
  RecoveryProfile,
  RecoverySetupInput,
} from '@better-days/shared';
import { CheckInsService } from '../checkins/checkins.service';
import { JournalService } from '../journal/journal.service';
import { RelapsesService } from '../relapses/relapses.service';
import { UrgesService } from '../urges/urges.service';
import { UsersService } from '../users/users.service';
import { computeMilestones } from './milestones';
import { computeStreaks, toUtcDayNumber } from './recovery-stats';

const RECENT_ACTIVITY_LIMIT = 5;

@Injectable()
export class DashboardService {
  constructor(
    private readonly usersService: UsersService,
    private readonly urgesService: UrgesService,
    private readonly relapsesService: RelapsesService,
    private readonly checkInsService: CheckInsService,
    private readonly journalService: JournalService,
  ) {}

  async getDashboard(userId: string): Promise<DashboardResponse> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException();
    }

    if (user.recoveryStartDate === null || user.dailySpendCents === null) {
      return {
        setupComplete: false,
        profile: null,
        stats: null,
        milestones: null,
        recentActivity: [],
      };
    }

    const { stats, milestones } = await this.computeProgress(
      userId,
      user.recoveryStartDate,
      user.dailySpendCents,
    );

    return {
      setupComplete: true,
      profile: this.toProfile(user.recoveryStartDate, user.dailySpendCents),
      stats,
      milestones,
      recentActivity: await this.getRecentActivity(userId),
    };
  }

  async saveRecoveryProfile(
    userId: string,
    input: RecoverySetupInput,
  ): Promise<RecoveryProfile> {
    await this.usersService.updateRecoveryProfile(userId, {
      recoveryStartDate: new Date(`${input.recoveryStartDate}T00:00:00.000Z`),
      dailySpendCents: Math.round(input.dailySpend * 100),
    });

    return {
      recoveryStartDate: input.recoveryStartDate,
      dailySpend: input.dailySpend,
    };
  }

  // Streak semantics live in ./recovery-stats (shared with analytics), the
  // milestone ladder in ./milestones. Money saved is days x daily spend minus
  // relapse spend, never below zero. Both read the same relapse fetch.
  private async computeProgress(
    userId: string,
    recoveryStartDate: Date,
    dailySpendCents: number,
  ): Promise<{ stats: DashboardStats; milestones: MilestonesSummary }> {
    const relapses = await this.relapsesService.findAllForStats(userId);

    const startDay = toUtcDayNumber(recoveryStartDate);
    const today = toUtcDayNumber(new Date());
    const recoveryDays = Math.max(0, today - startDay) + 1;
    const relapseDays = relapses.map((relapse) =>
      toUtcDayNumber(relapse.occurredAt),
    );

    const { currentStreakDays, longestStreakDays } = computeStreaks(
      startDay,
      today,
      relapseDays,
    );

    const spentCents = relapses.reduce(
      (sum, relapse) => sum + relapse.amountSpentCents,
      0,
    );

    return {
      stats: {
        currentStreakDays,
        longestStreakDays,
        moneySavedCents: Math.max(
          0,
          recoveryDays * dailySpendCents - spentCents,
        ),
        recoveryDays,
      },
      milestones: computeMilestones(
        startDay,
        today,
        relapseDays,
        currentStreakDays,
      ),
    };
  }

  private async getRecentActivity(
    userId: string,
  ): Promise<RecentActivityItem[]> {
    const [urges, relapses, checkIns, journalEntries] = await Promise.all([
      this.urgesService.findRecent(userId, RECENT_ACTIVITY_LIMIT),
      this.relapsesService.findRecent(userId, RECENT_ACTIVITY_LIMIT),
      this.checkInsService.findRecent(userId, RECENT_ACTIVITY_LIMIT),
      // Timestamps only — see JournalService.findRecentTimestamps.
      this.journalService.findRecentTimestamps(userId, RECENT_ACTIVITY_LIMIT),
    ]);

    const items: RecentActivityItem[] = [
      ...urges.map((urge) => ({
        id: urge.id,
        type: 'urge' as const,
        label: `Urge managed — intensity ${urge.intensity}/10 (${urge.trigger})`,
        occurredAt: urge.occurredAt,
      })),
      ...relapses.map((relapse) => ({
        id: relapse.id,
        type: 'relapse' as const,
        label: `Setback logged — $${(relapse.amountSpentCents / 100).toFixed(2)} (${relapse.trigger})`,
        occurredAt: relapse.occurredAt,
      })),
      ...checkIns.map((checkIn) => ({
        id: checkIn.id,
        type: 'checkin' as const,
        label:
          checkIn.period === 'morning'
            ? 'Morning check-in completed'
            : 'Evening check-in completed',
        occurredAt: checkIn.createdAt,
      })),
      ...journalEntries.map((entry) => ({
        id: entry.id,
        type: 'journal' as const,
        // Never an excerpt. The feed says an entry exists, nothing more.
        label: 'Journal entry written',
        occurredAt: entry.createdAt.toISOString(),
      })),
    ];

    return items
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
      .slice(0, RECENT_ACTIVITY_LIMIT);
  }

  private toProfile(
    recoveryStartDate: Date,
    dailySpendCents: number,
  ): RecoveryProfile {
    return {
      recoveryStartDate: recoveryStartDate.toISOString().slice(0, 10),
      dailySpend: dailySpendCents / 100,
    };
  }
}
