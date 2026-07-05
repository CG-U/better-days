import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UrgesModule } from '../urges/urges.module';
import { UsersModule } from '../users/users.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [AuthModule, UsersModule, UrgesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
