import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RelapsesController } from './relapses.controller';
import { RelapsesService } from './relapses.service';

@Module({
  imports: [AuthModule],
  controllers: [RelapsesController],
  providers: [RelapsesService],
  exports: [RelapsesService],
})
export class RelapsesModule {}
