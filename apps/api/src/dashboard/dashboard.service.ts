import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  DashboardResponse,
  DashboardStats,
  RecentActivityItem,
  RecoveryProfile,
  RecoverySetupInput,
} from '@better-days/shared';
import { CheckInsService } from '../checkins/checkins.service';
import { RelapsesService } from '../relapses/relapses.service';
import { UrgesService } from '../urges/urges.service';
import { UsersService } from '../users/users.service';
import { computeStreaks, toUtcDayNumber } from './recovery-stats';

const RECENT_ACTIVITY_LIMIT = 5;

@Injectable()
export class DashboardService {
  constructor(
    private readonly usersService: UsersService,
    private readonly urgesService: UrgesService,
    private readonly relapsesService: RelapsesService,
    private readonly checkInsService: CheckInsService,
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
        recentActivity: [],
      };
    }

    return {
      setupComplete: true,
      profile: this.toProfile(user.recoveryStartDate, user.dailySpendCents),
      stats: await this.computeStats(
        userId,
        user.recoveryStartDate,
        user.dailySpendCents,
      ),
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

  // Streak semantics live in ./recovery-stats (shared with analytics).
  // Money saved is days x daily spend minus relapse spend, never below zero.
  private async computeStats(
    userId: string,
    recoveryStartDate: Date,
    dailySpendCents: number,
  ): Promise<DashboardStats> {
    const relapses = await this.relapsesService.findAllForStats(userId);

    const startDay = toUtcDayNumber(recoveryStartDate);
    const today = toUtcDayNumber(new Date());
    const recoveryDays = Math.max(0, today - startDay) + 1;

    const { currentStreakDays, longestStreakDays } = computeStreaks(
      startDay,
      today,
      relapses.map((relapse) => toUtcDayNumber(relapse.occurredAt)),
    );

    const spentCents = relapses.reduce(
      (sum, relapse) => sum + relapse.amountSpentCents,
      0,
    );

    return {
      currentStreakDays,
      longestStreakDays,
      moneySavedCents: Math.max(0, recoveryDays * dailySpendCents - spentCents),
      recoveryDays,
    };
  }

  private async getRecentActivity(
    userId: string,
  ): Promise<RecentActivityItem[]> {
    const [urges, relapses, checkIns] = await Promise.all([
      this.urgesService.findRecent(userId, RECENT_ACTIVITY_LIMIT),
      this.relapsesService.findRecent(userId, RECENT_ACTIVITY_LIMIT),
      this.checkInsService.findRecent(userId, RECENT_ACTIVITY_LIMIT),
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
