import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TzOffsetSchema } from '@better-days/shared';
import type { AnalyticsResponse } from '@better-days/shared';
import type { JwtPayload } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  getAnalytics(
    @CurrentUser() payload: JwtPayload,
    @Query('tzOffset', new ZodValidationPipe(TzOffsetSchema))
    tzOffset: number,
  ): Promise<AnalyticsResponse> {
    return this.analyticsService.getAnalytics(payload.sub, tzOffset);
  }
}
