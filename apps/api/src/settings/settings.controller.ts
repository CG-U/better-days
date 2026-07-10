import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ChangePasswordSchema,
  DeleteAccountSchema,
  UpdateProfileSchema,
} from '@better-days/shared';
import type {
  ChangePasswordInput,
  DeleteAccountInput,
  ProfileResponse,
  UpdateProfileInput,
} from '@better-days/shared';
import type { Response } from 'express';
import { clearAuthCookie } from '../auth/auth-cookie';
import type { JwtPayload } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly configService: ConfigService,
  ) {}

  @Get('profile')
  async getProfile(
    @CurrentUser() payload: JwtPayload,
  ): Promise<ProfileResponse> {
    const profile = await this.settingsService.getProfile(payload.sub);
    return { profile };
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() payload: JwtPayload,
    @Body(new ZodValidationPipe(UpdateProfileSchema))
    input: UpdateProfileInput,
  ): Promise<ProfileResponse> {
    const profile = await this.settingsService.updateProfile(
      payload.sub,
      input,
    );
    return { profile };
  }

  @Put('password')
  @HttpCode(204)
  async changePassword(
    @CurrentUser() payload: JwtPayload,
    @Body(new ZodValidationPipe(ChangePasswordSchema))
    input: ChangePasswordInput,
  ): Promise<void> {
    await this.settingsService.changePassword(payload.sub, input);
  }

  /**
   * Clears the session cookie as well as the row. Leaving it set would send the
   * browser back with a token whose `sub` no longer resolves to anyone.
   */
  @Delete('account')
  @HttpCode(204)
  async deleteAccount(
    @CurrentUser() payload: JwtPayload,
    @Body(new ZodValidationPipe(DeleteAccountSchema))
    input: DeleteAccountInput,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.settingsService.deleteAccount(payload.sub, input);
    clearAuthCookie(response, this.configService);
  }
}
