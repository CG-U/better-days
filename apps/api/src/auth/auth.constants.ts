export { AUTH_COOKIE_NAME } from '@better-days/shared';

export const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  sub: string;
  email: string;
}
