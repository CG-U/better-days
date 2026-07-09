import { Injectable, NotFoundException } from '@nestjs/common';
import { UrgeOutcomeSchema } from '@better-days/shared';
import type {
  CreateUrgeInput,
  ResolveUrgeInput,
  Urge,
  UrgeOutcome,
} from '@better-days/shared';
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

  /** Scoped by userId so one user can never read another's urge by guessing an id. */
  async findOne(userId: string, id: string): Promise<Urge> {
    const urge = await this.prisma.urge.findFirst({ where: { id, userId } });
    if (!urge) {
      throw new NotFoundException('We could not find that entry.');
    }
    return this.toUrge(urge);
  }

  /**
   * Records how an urge ended. Re-resolving is allowed — someone who tapped the
   * wrong button, or logged a setback later, should be able to correct it.
   */
  async resolve(
    userId: string,
    id: string,
    input: ResolveUrgeInput,
  ): Promise<Urge> {
    await this.findOne(userId, id); // 404s if it is not theirs
    const urge = await this.prisma.urge.update({
      where: { id },
      data: { outcome: input.outcome, resolvedAt: new Date() },
    });
    return this.toUrge(urge);
  }

  // Everything the analytics buckets need, oldest first.
  findAllForStats(
    userId: string,
  ): Promise<Array<{ occurredAt: Date; trigger: string }>> {
    return this.prisma.urge.findMany({
      where: { userId },
      orderBy: { occurredAt: 'asc' },
      select: { occurredAt: true, trigger: true },
    });
  }

  private toUrge(urge: UrgeModel): Urge {
    return {
      id: urge.id,
      intensity: urge.intensity,
      trigger: urge.trigger,
      notes: urge.notes,
      outcome: this.toOutcome(urge.outcome),
      occurredAt: urge.occurredAt.toISOString(),
      resolvedAt: urge.resolvedAt?.toISOString() ?? null,
    };
  }

  /**
   * `outcome` is a plain column, so the database could in principle hold a value
   * the shared enum does not know (a bad backfill, a hand-edited row). Treat
   * anything unrecognised as unresolved rather than leaking it to the client.
   */
  private toOutcome(value: string): UrgeOutcome {
    const parsed = UrgeOutcomeSchema.safeParse(value);
    return parsed.success ? parsed.data : 'unresolved';
  }
}
