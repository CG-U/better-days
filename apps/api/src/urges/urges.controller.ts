import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUrgeSchema } from '@better-days/shared';
import type {
  CreateUrgeInput,
  UrgeResponse,
  UrgesResponse,
} from '@better-days/shared';
import type { JwtPayload } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { UrgesService } from './urges.service';

@Controller('urges')
@UseGuards(JwtAuthGuard)
export class UrgesController {
  constructor(private readonly urgesService: UrgesService) {}

  @Post()
  async create(
    @CurrentUser() payload: JwtPayload,
    @Body(new ZodValidationPipe(CreateUrgeSchema)) input: CreateUrgeInput,
  ): Promise<UrgeResponse> {
    const urge = await this.urgesService.create(payload.sub, input);
    return { urge };
  }

  @Get()
  async list(@CurrentUser() payload: JwtPayload): Promise<UrgesResponse> {
    const urges = await this.urgesService.findRecent(payload.sub);
    return { urges };
  }
}
