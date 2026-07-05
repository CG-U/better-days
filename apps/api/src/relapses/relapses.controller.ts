import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateRelapseSchema } from '@better-days/shared';
import type {
  CreateRelapseInput,
  RelapseResponse,
  RelapsesResponse,
} from '@better-days/shared';
import type { JwtPayload } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RelapsesService } from './relapses.service';

@Controller('relapses')
@UseGuards(JwtAuthGuard)
export class RelapsesController {
  constructor(private readonly relapsesService: RelapsesService) {}

  @Post()
  async create(
    @CurrentUser() payload: JwtPayload,
    @Body(new ZodValidationPipe(CreateRelapseSchema)) input: CreateRelapseInput,
  ): Promise<RelapseResponse> {
    const relapse = await this.relapsesService.create(payload.sub, input);
    return { relapse };
  }

  @Get()
  async list(@CurrentUser() payload: JwtPayload): Promise<RelapsesResponse> {
    const relapses = await this.relapsesService.findRecent(payload.sub);
    return { relapses };
  }
}
