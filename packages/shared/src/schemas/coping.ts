import { z } from 'zod';

/**
 * A cap, not a limit anyone should reach. A toolkit you have to scroll through
 * is useless in the ten seconds you have mid-craving.
 */
export const COPING_STRATEGY_MAX = 12;

export const COPING_LABEL_MAX = 80;

export const CreateCopingStrategySchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, 'Write down something that helps')
    .max(COPING_LABEL_MAX, `Keep it under ${COPING_LABEL_MAX} characters`),
});

export type CreateCopingStrategyInput = z.infer<
  typeof CreateCopingStrategySchema
>;

export interface CopingStrategy {
  id: string;
  label: string;
  /** How often the user has said this one worked. Sorts the list. */
  helpedCount: number;
}

export interface CopingStrategyResponse {
  strategy: CopingStrategy;
}

export interface CopingStrategiesResponse {
  strategies: CopingStrategy[];
}
