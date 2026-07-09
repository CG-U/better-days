import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { COPING_STRATEGY_MAX } from '@better-days/shared';
import type {
  CopingStrategy,
  CreateCopingStrategyInput,
} from '@better-days/shared';
import { CopingStrategy as CopingStrategyModel } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class CopingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Most-helpful first. Ties fall back to creation order so the list does not
   * reshuffle unpredictably while a brand-new toolkit is still all zeroes.
   */
  async findAll(userId: string): Promise<CopingStrategy[]> {
    const strategies = await this.prisma.copingStrategy.findMany({
      where: { userId },
      orderBy: [{ helpedCount: 'desc' }, { createdAt: 'asc' }],
    });
    return strategies.map((strategy) => this.toStrategy(strategy));
  }

  async create(
    userId: string,
    input: CreateCopingStrategyInput,
  ): Promise<CopingStrategy> {
    const count = await this.prisma.copingStrategy.count({ where: { userId } });
    if (count >= COPING_STRATEGY_MAX) {
      throw new BadRequestException(
        `A toolkit works best when it is short. Remove one to add another (${COPING_STRATEGY_MAX} max).`,
      );
    }

    const existing = await this.prisma.copingStrategy.findUnique({
      where: { userId_label: { userId, label: input.label } },
    });
    if (existing) {
      throw new ConflictException('That one is already in your toolkit.');
    }

    const strategy = await this.prisma.copingStrategy.create({
      data: { userId, label: input.label },
    });
    return this.toStrategy(strategy);
  }

  async remove(userId: string, id: string): Promise<void> {
    // deleteMany scopes by userId in one statement: another user's id deletes
    // nothing rather than throwing after the fact.
    const { count } = await this.prisma.copingStrategy.deleteMany({
      where: { id, userId },
    });
    if (count === 0) {
      throw new NotFoundException('We could not find that entry.');
    }
  }

  /** "This helped" — the only signal that sorts the toolkit. */
  async markHelped(userId: string, id: string): Promise<CopingStrategy> {
    const { count } = await this.prisma.copingStrategy.updateMany({
      where: { id, userId },
      data: { helpedCount: { increment: 1 } },
    });
    if (count === 0) {
      throw new NotFoundException('We could not find that entry.');
    }

    const strategy = await this.prisma.copingStrategy.findUniqueOrThrow({
      where: { id },
    });
    return this.toStrategy(strategy);
  }

  private toStrategy(strategy: CopingStrategyModel): CopingStrategy {
    return {
      id: strategy.id,
      label: strategy.label,
      helpedCount: strategy.helpedCount,
    };
  }
}
