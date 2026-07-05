import { Injectable } from '@nestjs/common';
import type { CreateUrgeInput, Urge } from '@better-days/shared';
import { Urge as UrgeModel } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class UrgesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateUrgeInput): Promise<Urge> {
    const urge = await this.prisma.urge.create({
      data: {
        userId,
        intensity: input.intensity,
        trigger: input.trigger,
        notes: input.notes ?? null,
      },
    });
    return this.toUrge(urge);
  }

  async findRecent(userId: string, limit = 20): Promise<Urge[]> {
    const urges = await this.prisma.urge.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' },
      take: limit,
    });
    return urges.map((urge) => this.toUrge(urge));
  }

  private toUrge(urge: UrgeModel): Urge {
    return {
      id: urge.id,
      intensity: urge.intensity,
      trigger: urge.trigger,
      notes: urge.notes,
      occurredAt: urge.occurredAt.toISOString(),
    };
  }
}
