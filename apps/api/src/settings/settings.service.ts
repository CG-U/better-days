import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type {
  ChangePasswordInput,
  DeleteAccountInput,
  UpdateProfileInput,
  UserProfile,
} from '@better-days/shared';
import { User } from '@prisma/client';
import { hashPassword, verifyPassword } from '../auth/password';
import { toAvatarColor } from '../users/user-profile';
import { UsersService } from '../users/users.service';

@Injectable()
export class SettingsService {
  constructor(private readonly usersService: UsersService) {}

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toProfile(user);
  }

  async updateProfile(
    userId: string,
    input: UpdateProfileInput,
  ): Promise<UserProfile> {
    const existing = await this.usersService.findByUsername(input.username);
    if (existing && existing.id !== userId) {
      throw new ConflictException('That username is already taken');
    }

    const user = await this.usersService.updateDisplayProfile(userId, {
      username: input.username,
      avatarColor: input.avatarColor,
    });
    return this.toProfile(user);
  }

  async changePassword(
    userId: string,
    input: ChangePasswordInput,
  ): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const matches = await verifyPassword(
      input.currentPassword,
      user.passwordHash,
    );
    if (!matches) {
      throw new UnauthorizedException('Your current password is incorrect');
    }

    await this.usersService.updatePasswordHash(
      userId,
      await hashPassword(input.newPassword),
    );
  }

  /**
   * Verifies the password, then deletes the user — cascading to every table
   * they own. There is no soft delete and no grace period: someone who asks
   * this app to forget them should be able to trust that it did.
   */
  async deleteAccount(
    userId: string,
    input: DeleteAccountInput,
  ): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const matches = await verifyPassword(input.password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('That password is incorrect');
    }

    await this.usersService.delete(userId);
  }

  private toProfile(user: User): UserProfile {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      avatarColor: toAvatarColor(user.avatarColor),
      createdAt: user.createdAt.toISOString(),
    };
  }
}
