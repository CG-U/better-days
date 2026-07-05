import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  DashboardResponse,
  RecentActivityItem,
  RecoveryProfile,
  RecoverySetupInput,
} from '@better-days/shared';
import { UrgesService } from '../urges/urges.service';
import { UsersService } from '../users/users.service';

const MS_PER_DAY = 86_400_000;
const RECENT_ACTIVITY_LIMIT = 5;

@Injectable()
export class DashboardService {
  constructor(
    private readonly usersService: UsersService,
    private readonly urgesService: UrgesService,
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

    const recoveryDays = this.daysSince(user.recoveryStartDate);

    return {
      setupComplete: true,
      profile: this.toProfile(user.recoveryStartDate, user.dailySpendCents),
      stats: {
        // No relapse data yet (Milestone 5) — until then the streak spans the
        // whole recovery period.
        currentStreakDays: recoveryDays,
        longestStreakDays: recoveryDays,
        moneySavedCents: recoveryDays * user.dailySpendCents,
        recoveryDays,
      },
      // Relapses and check-ins join this feed in Milestones 5–6.
      recentActivity: await this.getRecentActivity(userId),
    };
  }

  private async getRecentActivity(
    userId: string,
  ): Promise<RecentActivityItem[]> {
    const urges = await this.urgesService.findRecent(
      userId,
      RECENT_ACTIVITY_LIMIT,
    );
    return urges.map((urge) => ({
      id: urge.id,
      type: 'urge' as const,
      label: `Urge managed — intensity ${urge.intensity}/10 (${urge.trigger})`,
      occurredAt: urge.occurredAt,
    }));
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

  // Inclusive day count in UTC: starting today counts as day 1.
  private daysSince(start: Date): number {
    const now = new Date();
    const todayUtc = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    );
    const startUtc = Date.UTC(
      start.getUTCFullYear(),
      start.getUTCMonth(),
      start.getUTCDate(),
    );
    return Math.max(0, Math.floor((todayUtc - startUtc) / MS_PER_DAY)) + 1;
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
