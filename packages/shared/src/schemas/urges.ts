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

/**
 * How an urge ended. Every urge starts `unresolved` — the user is still riding
 * it out, or never came back to say. Recording the ending is what lets us tell
 * which triggers merely provoke a craving from which ones actually lead to
 * gambling; those are different questions with different answers.
 */
export const URGE_OUTCOMES = ['unresolved', 'passed', 'gambled'] as const;

export type UrgeOutcome = (typeof URGE_OUTCOMES)[number];

export const UrgeOutcomeSchema = z.enum(URGE_OUTCOMES);

/** An urge can be resolved, but never un-resolved back to the initial state. */
export const ResolveUrgeSchema = z.object({
  outcome: z.enum(['passed', 'gambled'], {
    errorMap: () => ({ message: 'Tell us how it ended' }),
  }),
});

export type ResolveUrgeInput = z.infer<typeof ResolveUrgeSchema>;

export interface Urge {
  id: string;
  intensity: number;
  trigger: string;
  notes: string | null;
  outcome: UrgeOutcome;
  occurredAt: string; // ISO datetime
  resolvedAt: string | null; // ISO datetime; null while unresolved
}

export interface UrgeResponse {
  urge: Urge;
}

export interface UrgesResponse {
  urges: Urge[];
}
