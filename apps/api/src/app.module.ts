import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CheckInsModule } from './checkins/checkins.module';
import { CopingModule } from './coping/coping.module';
import { JournalModule } from './journal/journal.module';
import { RelapsesModule } from './relapses/relapses.module';
import { SettingsModule } from './settings/settings.module';
import { UrgesModule } from './urges/urges.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    /**
     * Registered globally so the throttler's storage exists app-wide, but no
     * global `APP_GUARD` is bound: only the credential routes opt in, via
     * `AuthThrottlerGuard`. Storage is in-memory, so the limits are per
     * process — correct on a single Render instance, and something to revisit
     * (Redis storage) the day this scales horizontally.
     */
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    PrismaModule,
    UsersModule,
    AuthModule,
    DashboardModule,
    UrgesModule,
    RelapsesModule,
    CheckInsModule,
    AnalyticsModule,
    SettingsModule,
    CopingModule,
    JournalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
