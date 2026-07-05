import { Injectable } from '@nestjs/common';
import type { CreateRelapseInput, Relapse } from '@better-days/shared';
import { Relapse as RelapseModel } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class RelapsesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateRelapseInput): Promise<Relapse> {
    const relapse = await this.prisma.relapse.create({
      data: {
        userId,
        amountSpentCents: Math.round(input.amountSpent * 100),
        trigger: input.trigger,
        notes: input.notes ?? null,
      },
    });
    return this.toRelapse(relapse);
  }

  async findRecent(userId: string, limit = 20): Promise<Relapse[]> {
    const relapses = await this.prisma.relapse.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' },
      take: limit,
    });
    return relapses.map((relapse) => this.toRelapse(relapse));
  }

  // Everything the streak/savings/analytics math needs, oldest first.
  findAllForStats(
    userId: string,
  ): Promise<
    Array<{ occurredAt: Date; amountSpentCents: number; trigger: string }>
  > {
    return this.prisma.relapse.findMany({
      where: { userId },
      orderBy: { occurredAt: 'asc' },
      select: { occurredAt: true, amountSpentCents: true, trigger: true },
    });
  }

  private toRelapse(relapse: RelapseModel): Relapse {
    return {
      id: relapse.id,
      amountSpentCents: relapse.amountSpentCents,
      trigger: relapse.trigger,
      notes: relapse.notes,
      occurredAt: relapse.occurredAt.toISOString(),
    };
  }
}
