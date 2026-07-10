import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateJournalEntrySchema,
  UpdateJournalEntrySchema,
} from '@better-days/shared';
import type {
  CreateJournalEntryInput,
  JournalEntriesResponse,
  JournalEntryResponse,
  UpdateJournalEntryInput,
} from '@better-days/shared';
import type { JwtPayload } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JournalService } from './journal.service';

@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  async list(
    @CurrentUser() payload: JwtPayload,
  ): Promise<JournalEntriesResponse> {
    const entries = await this.journalService.findRecent(payload.sub);
    return { entries };
  }

  @Post()
  async create(
    @CurrentUser() payload: JwtPayload,
    @Body(new ZodValidationPipe(CreateJournalEntrySchema))
    input: CreateJournalEntryInput,
  ): Promise<JournalEntryResponse> {
    const entry = await this.journalService.create(payload.sub, input);
    return { entry };
  }

  @Patch(':id')
  async update(
    @CurrentUser() payload: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateJournalEntrySchema))
    input: UpdateJournalEntryInput,
  ): Promise<JournalEntryResponse> {
    const entry = await this.journalService.update(payload.sub, id, input);
    return { entry };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() payload: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.journalService.remove(payload.sub, id);
  }
}
