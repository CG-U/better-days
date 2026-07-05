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
import type { Response } from 'express';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AUTH_COOKIE_MAX_AGE_MS, AUTH_COOKIE_NAME } from './auth.constants';
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
  async register(
    @Body(new ZodValidationPipe(RegisterSchema)) input: RegisterInput,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const { user, token } = await this.authService.register(input);
    this.setAuthCookie(response, token);
    return { user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) input: LoginInput,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const { user, token } = await this.authService.login(input);
    this.setAuthCookie(response, token);
    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie(AUTH_COOKIE_NAME, this.cookieOptions());
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() payload: JwtPayload): Promise<AuthResponse> {
    const user = await this.authService.getAuthUser(payload.sub);
    return { user };
  }

  private setAuthCookie(response: Response, token: string): void {
    response.cookie(AUTH_COOKIE_NAME, token, {
      ...this.cookieOptions(),
      maxAge: AUTH_COOKIE_MAX_AGE_MS,
    });
  }

  private cookieOptions() {
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: this.configService.get('NODE_ENV') === 'production',
      path: '/',
    };
  }
}
