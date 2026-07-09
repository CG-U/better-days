import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CopingController } from './coping.controller';
import { CopingService } from './coping.service';

@Module({
  imports: [AuthModule],
  controllers: [CopingController],
  providers: [CopingService],
  exports: [CopingService],
})
export class CopingModule {}
