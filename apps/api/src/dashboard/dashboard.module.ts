import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CheckInsModule } from '../checkins/checkins.module';
import { JournalModule } from '../journal/journal.module';
import { RelapsesModule } from '../relapses/relapses.module';
import { UrgesModule } from '../urges/urges.module';
import { UsersModule } from '../users/users.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    UrgesModule,
    RelapsesModule,
    CheckInsModule,
    JournalModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
