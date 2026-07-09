/**
 * How long after an urge we still ask how it ended.
 *
 * Recall decays fast. Asking someone whether a craving three weeks ago ended in
 * gambling produces a guess, and guesses poison the urge→relapse conversion
 * stats this field exists to feed — an absent answer is more honest than an
 * invented one. Urges older than this simply stay unrecorded.
 */
export const OUTCOME_PROMPT_WINDOW_MS = 24 * 60 * 60 * 1000;

export function isWithinOutcomePromptWindow(
  occurredAt: string,
  now: number,
): boolean {
  return now - new Date(occurredAt).getTime() < OUTCOME_PROMPT_WINDOW_MS;
}
