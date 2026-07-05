import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RelapsesModule } from '../relapses/relapses.module';
import { UrgesModule } from '../urges/urges.module';
import { UsersModule } from '../users/users.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [AuthModule, UsersModule, UrgesModule, RelapsesModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
