import { z } from 'zod';
import { TriggerSchema } from './triggers';

export const CreateRelapseSchema = z.object({
  amountSpent: z
    .number({ invalid_type_error: 'Enter an amount' })
    .nonnegative('Amount cannot be negative')
    .max(1_000_000, 'Enter a smaller amount'),
  trigger: TriggerSchema,
  notes: z
    .string()
    .max(1000, 'Notes can be up to 1000 characters')
    .optional(),
});

export type CreateRelapseInput = z.infer<typeof CreateRelapseSchema>;

export interface Relapse {
  id: string;
  amountSpentCents: number;
  trigger: string;
  notes: string | null;
  occurredAt: string; // ISO datetime
}

export interface RelapseResponse {
  relapse: Relapse;
}

export interface RelapsesResponse {
  relapses: Relapse[];
}
