import { Injectable } from '@nestjs/common';
import type {
  CheckIn,
  CheckInDayResponse,
  CheckInPeriod,
  SaveCheckInInput,
} from '@better-days/shared';
import { CheckIn as CheckInModel } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class CheckInsService {
  constructor(private readonly prisma: PrismaService) {}

  // One entry per (user, day, period): saving again updates in place.
  async save(userId: string, input: SaveCheckInInput): Promise<CheckIn> {
    const date = this.toDbDate(input.date);
    const fields =
      input.period === 'morning'
        ? {
            mood: input.mood,
            sleepQuality: input.sleepQuality,
            stressLevel: input.stressLevel,
            intention: input.intention ?? null,
          }
        : {
            urgesToday: input.urgesToday,
            reflection: input.reflection ?? null,
            gratitude: input.gratitude ?? null,
          };

    const checkIn = await this.prisma.checkIn.upsert({
      where: {
        userId_date_period: { userId, date, period: input.period },
      },
      create: { userId, date, period: input.period, ...fields },
      update: fields,
    });
    return this.toCheckIn(checkIn);
  }

  async findDay(userId: string, date: string): Promise<CheckInDayResponse> {
    const entries = await this.prisma.checkIn.findMany({
      where: { userId, date: this.toDbDate(date) },
    });
    return {
      morning: this.pick(entries, 'morning'),
      evening: this.pick(entries, 'evening'),
    };
  }

  async findRecent(userId: string, limit = 14): Promise<CheckIn[]> {
    const entries = await this.prisma.checkIn.findMany({
      where: { userId },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });
    return entries.map((entry) => this.toCheckIn(entry));
  }

  private pick(entries: CheckInModel[], period: CheckInPeriod): CheckIn | null {
    const entry = entries.find((candidate) => candidate.period === period);
    return entry ? this.toCheckIn(entry) : null;
  }

  private toDbDate(date: string): Date {
    return new Date(`${date}T00:00:00.000Z`);
  }

  private toCheckIn(entry: CheckInModel): CheckIn {
    return {
      id: entry.id,
      date: entry.date.toISOString().slice(0, 10),
      period: entry.period as CheckInPeriod,
      mood: entry.mood,
      sleepQuality: entry.sleepQuality,
      stressLevel: entry.stressLevel,
      intention: entry.intention,
      urgesToday: entry.urgesToday,
      reflection: entry.reflection,
      gratitude: entry.gratitude,
      createdAt: entry.createdAt.toISOString(),
    };
  }
}
