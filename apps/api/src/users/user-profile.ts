import { AVATAR_COLORS, type AvatarColor } from '@better-days/shared';

/**
 * `avatarColor` is a plain TEXT column, so narrow it back to the shared union
 * on the way out. An unrecognised value (e.g. a color removed from
 * AVATAR_COLORS) degrades to null rather than breaking the response.
 */
export function toAvatarColor(value: string | null): AvatarColor | null {
  return AVATAR_COLORS.includes(value as AvatarColor)
    ? (value as AvatarColor)
    : null;
}
