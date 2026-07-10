/**
 * Throttle windows, in one place so the numbers can be argued about without
 * hunting through decorators. `ttl` is milliseconds.
 */

/**
 * Ten guesses per five minutes against a single email. Passwords are bcrypt
 * hashed, so an online attacker is already slow; this makes them hopeless
 * without locking a legitimate user out for longer than they will tolerate on
 * the night they mistype their own password twice.
 */
export const LOGIN_THROTTLE = {
  default: { limit: 10, ttl: 5 * 60 * 1000 },
} as const;

/**
 * A speed bump, and honestly not much more: registration is keyed by the email
 * being registered, and an attacker minting fake accounts simply varies it.
 * Stopping that needs a trustworthy client IP, which this service cannot see.
 * What this does prevent is a double-tapped submit button turning into a 409.
 */
export const REGISTER_THROTTLE = {
  default: { limit: 5, ttl: 60 * 60 * 1000 },
} as const;
