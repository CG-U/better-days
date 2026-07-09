import { z } from 'zod';

/**
 * Avatar colors are keys, not hex — the web app maps each to a Serene Recovery
 * container token. Extend this constant, never hardcode a color in a component.
 */
export const AVATAR_COLORS = ['sage', 'sky', 'sand', 'plum', 'clay'] as const;

export type AvatarColor = (typeof AVATAR_COLORS)[number];

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;

export const UpdateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(USERNAME_MIN, `Username must be at least ${USERNAME_MIN} characters`)
    .max(USERNAME_MAX, `Username must be at most ${USERNAME_MAX} characters`)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Use only letters, numbers, underscores, and hyphens',
    ),
  avatarColor: z.enum(AVATAR_COLORS),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'Choose a password different from your current one',
    path: ['newPassword'],
  });

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  avatarColor: AvatarColor | null;
  createdAt: string;
}

export interface ProfileResponse {
  profile: UserProfile;
}
