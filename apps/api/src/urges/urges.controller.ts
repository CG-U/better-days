import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUrgeSchema, ResolveUrgeSchema } from '@better-days/shared';
import type {
  CreateUrgeInput,
  ResolveUrgeInput,
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

  // The ride-it-out screen is a deep link: on a cold load there is no list to
  // read from, so it fetches its urge directly.
  @Get(':id')
  async findOne(
    @CurrentUser() payload: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UrgeResponse> {
    const urge = await this.urgesService.findOne(payload.sub, id);
    return { urge };
  }

  @Patch(':id/outcome')
  async resolve(
    @CurrentUser() payload: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(ResolveUrgeSchema)) input: ResolveUrgeInput,
  ): Promise<UrgeResponse> {
    const urge = await this.urgesService.resolve(payload.sub, id, input);
    return { urge };
  }
}
