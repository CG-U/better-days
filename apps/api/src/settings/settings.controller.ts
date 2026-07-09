import {
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ChangePasswordSchema, UpdateProfileSchema } from '@better-days/shared';
import type {
  ChangePasswordInput,
  ProfileResponse,
  UpdateProfileInput,
} from '@better-days/shared';
import type { JwtPayload } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

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
}
