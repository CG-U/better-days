import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  AnalyticsResponse,
  SavingsPoint,
  TimelineEvent,
  TriggerCount,
} from '@better-days/shared';
import {
  computeStreaks,
  toUtcDayNumber,
  utcDayNumberToDateString,
} from '../dashboard/recovery-stats';
import { RelapsesService } from '../relapses/relapses.service';
import { UrgesService } from '../urges/urges.service';
import { UsersService } from '../users/users.service';

const MS_PER_MINUTE = 60_000;
const TOP_TRIGGERS_LIMIT = 5;
// Keep the savings chart readable regardless of how long recovery has run.
const MAX_SAVINGS_POINTS = 30;

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly urgesService: UrgesService,
    private readonly relapsesService: RelapsesService,
  ) {}

  async getAnalytics(
    userId: string,
    tzOffsetMinutes: number,
  ): Promise<AnalyticsResponse> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException();
    }

    const [urges, relapses] = await Promise.all([
      this.urgesService.findAllForStats(userId),
      this.relapsesService.findAllForStats(userId),
    ]);

    const urgesByHour = new Array<number>(24).fill(0);
    const urgesByWeekday = new Array<number>(7).fill(0);
    for (const urge of urges) {
      const local = this.toLocalParts(urge.occurredAt, tzOffsetMinutes);
      urgesByHour[local.hour] += 1;
      urgesByWeekday[local.weekday] += 1;
    }

    const setupComplete =
      user.recoveryStartDate !== null && user.dailySpendCents !== null;

    let longestStreakDays = 0;
    let moneySavedOverTime: SavingsPoint[] = [];
    let timeline: TimelineEvent[] = [];

    if (user.recoveryStartDate !== null && user.dailySpendCents !== null) {
      const startDay = toUtcDayNumber(user.recoveryStartDate);
      const today = toUtcDayNumber(new Date());
      const relapseDays = relapses.map((relapse) =>
        toUtcDayNumber(relapse.occurredAt),
      );

      const streaks = computeStreaks(startDay, today, relapseDays);
      longestStreakDays = streaks.longestStreakDays;

      moneySavedOverTime = this.buildSavingsSeries(
        startDay,
        today,
        user.dailySpendCents,
        relapses.map((relapse, index) => ({
          day: relapseDays[index],
          amountCents: relapse.amountSpentCents,
        })),
      );

      timeline = [
        {
          date: utcDayNumberToDateString(startDay),
          type: 'start',
          label: 'Recovery started',
        },
        ...relapses.map((relapse, index): TimelineEvent => ({
          date: utcDayNumberToDateString(relapseDays[index]),
          type: 'relapse',
          label: `Setback — $${(relapse.amountSpentCents / 100).toFixed(2)} (${relapse.trigger})`,
        })),
        {
          date: utcDayNumberToDateString(today),
          type: 'today',
          label:
            streaks.currentStreakDays === 1
              ? 'Today — 1 day strong'
              : `Today — ${streaks.currentStreakDays} days strong`,
        },
      ];
    }

    return {
      setupComplete,
      longestStreakDays,
      totalUrges: urges.length,
      urgesByHour,
      urgesByWeekday,
      topTriggers: this.countTriggers([
        ...urges.map((urge) => urge.trigger),
        ...relapses.map((relapse) => relapse.trigger),
      ]),
      moneySavedOverTime,
      timeline,
    };
  }

  private toLocalParts(
    occurredAt: Date,
    tzOffsetMinutes: number,
  ): { hour: number; weekday: number } {
    const shifted = new Date(
      occurredAt.getTime() + tzOffsetMinutes * MS_PER_MINUTE,
    );
    return { hour: shifted.getUTCHours(), weekday: shifted.getUTCDay() };
  }

  private countTriggers(triggers: string[]): TriggerCount[] {
    const counts = new Map<string, number>();
    for (const trigger of triggers) {
      counts.set(trigger, (counts.get(trigger) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([trigger, count]) => ({ trigger, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_TRIGGERS_LIMIT);
  }

  private buildSavingsSeries(
    startDay: number,
    today: number,
    dailySpendCents: number,
    relapses: Array<{ day: number; amountCents: number }>,
  ): SavingsPoint[] {
    const totalDays = today - startDay + 1;
    const step = Math.max(1, Math.ceil(totalDays / MAX_SAVINGS_POINTS));

    const points: SavingsPoint[] = [];
    for (let day = startDay; day <= today; day += step) {
      points.push(
        this.savingsPointAt(day, startDay, dailySpendCents, relapses),
      );
    }
    if (points[points.length - 1]?.date !== utcDayNumberToDateString(today)) {
      points.push(
        this.savingsPointAt(today, startDay, dailySpendCents, relapses),
      );
    }
    return points;
  }

  private savingsPointAt(
    day: number,
    startDay: number,
    dailySpendCents: number,
    relapses: Array<{ day: number; amountCents: number }>,
  ): SavingsPoint {
    const saved = (day - startDay + 1) * dailySpendCents;
    const spent = relapses
      .filter((relapse) => relapse.day <= day)
      .reduce((sum, relapse) => sum + relapse.amountCents, 0);
    return {
      date: utcDayNumberToDateString(day),
      savedCents: Math.max(0, saved - spent),
    };
  }
}
