import { z } from 'zod';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// The client sends its local calendar day so "today" is the user's today.
export const CheckInDateSchema = z
  .string()
  .regex(DATE_ONLY_REGEX, 'Enter a valid date');

export const MorningCheckInSchema = z.object({
  period: z.literal('morning'),
  date: CheckInDateSchema,
  mood: z
    .number({ invalid_type_error: 'Pick how you are feeling' })
    .int()
    .min(1, 'Pick how you are feeling')
    .max(5),
  sleepQuality: z
    .number({ invalid_type_error: 'Slide to rate your sleep' })
    .int()
    .min(1)
    .max(10),
  stressLevel: z
    .number({ invalid_type_error: 'Pick a stress level' })
    .int()
    .min(1, 'Pick a stress level')
    .max(5),
  intention: z
    .string()
    .max(500, 'Intentions can be up to 500 characters')
    .optional(),
});

export const EveningCheckInSchema = z.object({
  period: z.literal('evening'),
  date: CheckInDateSchema,
  urgesToday: z
    .number({ invalid_type_error: 'Enter how many urges you noticed' })
    .int()
    .min(0, 'Cannot be negative')
    .max(99, 'Enter a smaller number'),
  reflection: z
    .string()
    .max(2000, 'Reflections can be up to 2000 characters')
    .optional(),
  gratitude: z
    .string()
    .max(2000, 'Gratitude notes can be up to 2000 characters')
    .optional(),
});

export const SaveCheckInSchema = z.discriminatedUnion('period', [
  MorningCheckInSchema,
  EveningCheckInSchema,
]);

export type MorningCheckInInput = z.infer<typeof MorningCheckInSchema>;
export type EveningCheckInInput = z.infer<typeof EveningCheckInSchema>;
export type SaveCheckInInput = z.infer<typeof SaveCheckInSchema>;

export type CheckInPeriod = SaveCheckInInput['period'];

export interface CheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  period: CheckInPeriod;
  mood: number | null;
  sleepQuality: number | null;
  stressLevel: number | null;
  intention: string | null;
  urgesToday: number | null;
  reflection: string | null;
  gratitude: string | null;
  createdAt: string; // ISO datetime
}

export interface CheckInResponse {
  checkIn: CheckIn;
}

export interface CheckInDayResponse {
  morning: CheckIn | null;
  evening: CheckIn | null;
}

export interface CheckInsResponse {
  checkIns: CheckIn[];
}
