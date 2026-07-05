import { z } from 'zod';

// Shared with the relapse tracker (Milestone 5) and analytics (Milestone 7).
export const URGE_TRIGGERS = [
  'Stress',
  'Boredom',
  'Social',
  'Environment',
  'Tiredness',
  'Hunger',
] as const;

export type UrgeTrigger = (typeof URGE_TRIGGERS)[number];

export const CreateUrgeSchema = z.object({
  intensity: z
    .number({ invalid_type_error: 'Slide to set an intensity' })
    .int()
    .min(1, 'Intensity is between 1 and 10')
    .max(10, 'Intensity is between 1 and 10'),
  trigger: z.enum(URGE_TRIGGERS, {
    errorMap: () => ({ message: 'Choose what triggered this' }),
  }),
  notes: z
    .string()
    .max(1000, 'Notes can be up to 1000 characters')
    .optional(),
});

export type CreateUrgeInput = z.infer<typeof CreateUrgeSchema>;

export interface Urge {
  id: string;
  intensity: number;
  trigger: string;
  notes: string | null;
  occurredAt: string; // ISO datetime
}

export interface UrgeResponse {
  urge: Urge;
}

export interface UrgesResponse {
  urges: Urge[];
}
