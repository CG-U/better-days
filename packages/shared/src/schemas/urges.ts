import { z } from 'zod';
import { TriggerSchema } from './triggers';

export const CreateUrgeSchema = z.object({
  intensity: z
    .number({ invalid_type_error: 'Slide to set an intensity' })
    .int()
    .min(1, 'Intensity is between 1 and 10')
    .max(10, 'Intensity is between 1 and 10'),
  trigger: TriggerSchema,
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
