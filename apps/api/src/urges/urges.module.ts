import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UrgesController } from './urges.controller';
import { UrgesService } from './urges.service';

@Module({
  imports: [AuthModule],
  controllers: [UrgesController],
  providers: [UrgesService],
  exports: [UrgesService],
})
export class UrgesModule {}
