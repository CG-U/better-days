import type { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';
import { AUTH_COOKIE_MAX_AGE_MS, AUTH_COOKIE_NAME } from './auth.constants';

/**
 * The single source of the session cookie's attributes. `clearCookie` only
 * removes a cookie whose name, path, and sameSite match the one that was set,
 * so anything that signs a user out — logout, account deletion — must clear it
 * with exactly these options. Do not inline a second copy.
 */
export function authCookieOptions(config: ConfigService): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.get('NODE_ENV') === 'production',
    path: '/',
  };
}

export function setAuthCookie(
  response: Response,
  config: ConfigService,
  token: string,
): void {
  response.cookie(AUTH_COOKIE_NAME, token, {
    ...authCookieOptions(config),
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
  });
}

export function clearAuthCookie(
  response: Response,
  config: ConfigService,
): void {
  response.clearCookie(AUTH_COOKIE_NAME, authCookieOptions(config));
}
