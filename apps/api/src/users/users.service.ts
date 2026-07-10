import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(email: string, passwordHash: string): Promise<User> {
    return this.prisma.user.create({ data: { email, passwordHash } });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  updateRecoveryProfile(
    id: string,
    data: { recoveryStartDate: Date; dailySpendCents: number },
  ): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  updateDisplayProfile(
    id: string,
    data: { username: string; avatarColor: string },
  ): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  updatePasswordHash(id: string, passwordHash: string): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: { passwordHash } });
  }

  /**
   * Irreversible. Every user-owned table declares `onDelete: Cascade`, so this
   * one statement removes the urges, relapses, check-ins, coping strategies,
   * and journal entries too. Anything added later must keep that FK rule, or a
   * deleted account will leave its most private rows behind.
   */
  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
