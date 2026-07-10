import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginSchema, RegisterSchema } from '@better-days/shared';
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
} from '@better-days/shared';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AuthThrottlerGuard } from '../common/throttler/auth-throttler.guard';
import {
  LOGIN_THROTTLE,
  REGISTER_THROTTLE,
} from '../common/throttler/throttle-limits';
import { clearAuthCookie, setAuthCookie } from './auth-cookie';
import type { JwtPayload } from './auth.constants';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @UseGuards(AuthThrottlerGuard)
  @Throttle(REGISTER_THROTTLE)
  async register(
    @Body(new ZodValidationPipe(RegisterSchema)) input: RegisterInput,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const { user, token } = await this.authService.register(input);
    setAuthCookie(response, this.configService, token);
    return { user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthThrottlerGuard)
  @Throttle(LOGIN_THROTTLE)
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) input: LoginInput,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const { user, token } = await this.authService.login(input);
    setAuthCookie(response, this.configService, token);
    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) response: Response): void {
    clearAuthCookie(response, this.configService);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() payload: JwtPayload): Promise<AuthResponse> {
    const user = await this.authService.getAuthUser(payload.sub);
    return { user };
  }
}
