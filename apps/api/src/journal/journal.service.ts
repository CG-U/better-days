import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateJournalEntryInput,
  JournalEntry,
  UpdateJournalEntryInput,
} from '@better-days/shared';
import { JournalEntry as JournalEntryModel } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';

const RECENT_LIMIT = 30;

@Injectable()
export class JournalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    input: CreateJournalEntryInput,
  ): Promise<JournalEntry> {
    const entry = await this.prisma.journalEntry.create({
      data: { userId, body: input.body },
    });
    return this.toEntry(entry);
  }

  /** Newest first — the page opens on what you last wrote. */
  async findRecent(
    userId: string,
    limit = RECENT_LIMIT,
  ): Promise<JournalEntry[]> {
    const entries = await this.prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return entries.map((entry) => this.toEntry(entry));
  }

  async update(
    userId: string,
    id: string,
    input: UpdateJournalEntryInput,
  ): Promise<JournalEntry> {
    // updateMany scopes by userId in one statement: another user's id matches
    // zero rows, so we 404 without ever confirming the row exists.
    const { count } = await this.prisma.journalEntry.updateMany({
      where: { id, userId },
      data: { body: input.body },
    });
    if (count === 0) {
      throw new NotFoundException('We could not find that entry.');
    }

    const entry = await this.prisma.journalEntry.findUniqueOrThrow({
      where: { id },
    });
    return this.toEntry(entry);
  }

  async remove(userId: string, id: string): Promise<void> {
    const { count } = await this.prisma.journalEntry.deleteMany({
      where: { id, userId },
    });
    if (count === 0) {
      throw new NotFoundException('We could not find that entry.');
    }
  }

  /**
   * Timestamps only. The dashboard feed says an entry exists and never what it
   * says — the home screen is the one place a private page must not leak onto.
   */
  findRecentTimestamps(
    userId: string,
    limit: number,
  ): Promise<Array<{ id: string; createdAt: Date }>> {
    return this.prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { id: true, createdAt: true },
    });
  }

  private toEntry(entry: JournalEntryModel): JournalEntry {
    return {
      id: entry.id,
      body: entry.body,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    };
  }
}
