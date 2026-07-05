import { z } from 'zod';

// Shared by urges, relapses, and analytics — extend here, never inline.
export const TRIGGERS = [
  'Stress',
  'Boredom',
  'Social',
  'Environment',
  'Tiredness',
  'Hunger',
] as const;

export type TriggerOption = (typeof TRIGGERS)[number];

export const TriggerSchema = z.enum(TRIGGERS, {
  errorMap: () => ({ message: 'Choose what triggered this' }),
});
