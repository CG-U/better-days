import { z } from 'zod';

/**
 * Generous on purpose. A journal is the one place in this app with no scoring,
 * no aggregation, and no opinion about what you wrote — the only reason for a
 * cap at all is to keep a runaway paste out of the database.
 */
export const JOURNAL_BODY_MAX = 5000;

export const JournalEntryBodySchema = z
  .string()
  .trim()
  .min(1, 'Write something first')
  .max(JOURNAL_BODY_MAX, `Keep it under ${JOURNAL_BODY_MAX} characters`);

export const CreateJournalEntrySchema = z.object({
  body: JournalEntryBodySchema,
});

export type CreateJournalEntryInput = z.infer<typeof CreateJournalEntrySchema>;

export const UpdateJournalEntrySchema = CreateJournalEntrySchema;

export type UpdateJournalEntryInput = z.infer<typeof UpdateJournalEntrySchema>;

export interface JournalEntry {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntryResponse {
  entry: JournalEntry;
}

export interface JournalEntriesResponse {
  entries: JournalEntry[];
}
