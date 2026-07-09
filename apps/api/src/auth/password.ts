import * as bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 12;

/** Single source of truth for the hashing cost — auth and settings share it. */
export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
