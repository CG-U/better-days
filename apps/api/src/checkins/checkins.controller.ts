import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { CheckInDateSchema, SaveCheckInSchema } from '@better-days/shared';
import type {
  CheckInDayResponse,
  CheckInResponse,
  CheckInsResponse,
  SaveCheckInInput,
} from '@better-days/shared';
import type { JwtPayload } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CheckInsService } from './checkins.service';

@Controller('checkins')
@UseGuards(JwtAuthGuard)
export class CheckInsController {
  constructor(private readonly checkInsService: CheckInsService) {}

  @Put()
  async save(
    @CurrentUser() payload: JwtPayload,
    @Body(new ZodValidationPipe(SaveCheckInSchema)) input: SaveCheckInInput,
  ): Promise<CheckInResponse> {
    const checkIn = await this.checkInsService.save(payload.sub, input);
    return { checkIn };
  }

  @Get('day')
  getDay(
    @CurrentUser() payload: JwtPayload,
    @Query('date', new ZodValidationPipe(CheckInDateSchema)) date: string,
  ): Promise<CheckInDayResponse> {
    return this.checkInsService.findDay(payload.sub, date);
  }

  @Get()
  async list(@CurrentUser() payload: JwtPayload): Promise<CheckInsResponse> {
    const checkIns = await this.checkInsService.findRecent(payload.sub);
    return { checkIns };
  }
}
