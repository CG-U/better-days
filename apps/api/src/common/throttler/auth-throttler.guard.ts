import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

/**
 * Rate limits the credential endpoints by **email address, not IP**.
 *
 * The browser never reaches this API directly: `apps/web/next.config.ts`
 * rewrites `/api/*` to it, so every request arrives from the web server's own
 * address. Throttling on `req.ip` would therefore count every user in the world
 * as one client. Trusting `X-Forwarded-For` instead is worse — it arrives here
 * exactly as the caller wrote it (verified: a request with a hand-set
 * `X-Forwarded-For: 9.9.9.9` reached this process with that value intact), so
 * an attacker rotates it per request and the limit evaporates.
 *
 * Keying on the submitted email defends the threat that actually matters:
 * grinding passwords against one account. It cannot stop a spray across many
 * accounts, which needs a real client IP and therefore a limiter in the web
 * layer, where Vercel's edge sets a trustworthy one.
 *
 * The trade-off is deliberate: someone who knows your email can spend ten
 * requests to lock you out of your own login for five minutes. That is an
 * annoyance. Unlimited offline-speed guessing against a password hash is not.
 */
@Injectable()
export class AuthThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Request): Promise<string> {
    const email = readEmail(req.body);

    // Guards run before pipes, so the body is unvalidated. A request with no
    // usable email falls back to the (shared) source address, which throttles
    // malformed floods as one bucket — acceptable, since they never reach a
    // password check.
    return Promise.resolve(
      email ? `email:${email}` : `src:${req.ip ?? 'unknown'}`,
    );
  }

  protected getErrorMessage(): Promise<string> {
    // Non-punitive, and deliberately vague about which account exists.
    return Promise.resolve(
      'Too many attempts. Please wait a few minutes and try again.',
    );
  }
}

function readEmail(body: unknown): string | null {
  if (typeof body !== 'object' || body === null || !('email' in body)) {
    return null;
  }

  const { email } = body;
  return typeof email === 'string' && email.length > 0
    ? email.trim().toLowerCase()
    : null;
}
