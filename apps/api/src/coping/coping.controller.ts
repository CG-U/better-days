import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCopingStrategySchema } from '@better-days/shared';
import type {
  CopingStrategiesResponse,
  CopingStrategyResponse,
  CreateCopingStrategyInput,
} from '@better-days/shared';
import type { JwtPayload } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CopingService } from './coping.service';

@Controller('coping-strategies')
@UseGuards(JwtAuthGuard)
export class CopingController {
  constructor(private readonly copingService: CopingService) {}

  @Get()
  async list(
    @CurrentUser() payload: JwtPayload,
  ): Promise<CopingStrategiesResponse> {
    const strategies = await this.copingService.findAll(payload.sub);
    return { strategies };
  }

  @Post()
  async create(
    @CurrentUser() payload: JwtPayload,
    @Body(new ZodValidationPipe(CreateCopingStrategySchema))
    input: CreateCopingStrategyInput,
  ): Promise<CopingStrategyResponse> {
    const strategy = await this.copingService.create(payload.sub, input);
    return { strategy };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() payload: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.copingService.remove(payload.sub, id);
  }

  @Post(':id/helped')
  async markHelped(
    @CurrentUser() payload: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CopingStrategyResponse> {
    const strategy = await this.copingService.markHelped(payload.sub, id);
    return { strategy };
  }
}
