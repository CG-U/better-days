import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { RecoverySetupSchema } from '@better-days/shared';
import type {
  DashboardResponse,
  RecoveryProfileResponse,
  RecoverySetupInput,
} from '@better-days/shared';
import type { JwtPayload } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(@CurrentUser() payload: JwtPayload): Promise<DashboardResponse> {
    return this.dashboardService.getDashboard(payload.sub);
  }

  @Put('recovery')
  async saveRecovery(
    @CurrentUser() payload: JwtPayload,
    @Body(new ZodValidationPipe(RecoverySetupSchema)) input: RecoverySetupInput,
  ): Promise<RecoveryProfileResponse> {
    const profile = await this.dashboardService.saveRecoveryProfile(
      payload.sub,
      input,
    );
    return { profile };
  }
}
