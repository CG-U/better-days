import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Security headers. This service answers JSON only and is reached through the
   * web app's `/api/*` rewrite rather than by a browser directly, so helmet's
   * defaults cost nothing here and cover the day that stops being true.
   *
   * Express's `trust proxy` is deliberately left off: the rewrite forwards
   * `X-Forwarded-For` exactly as the caller wrote it, so trusting it would let
   * anyone claim any address. See `AuthThrottlerGuard`.
   */
  app.use(helmet());
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
