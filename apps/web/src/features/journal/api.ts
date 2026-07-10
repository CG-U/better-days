import type {
  CreateJournalEntryInput,
  JournalEntriesResponse,
  JournalEntryResponse,
  UpdateJournalEntryInput,
} from "@better-days/shared";
import { apiClient } from "@/lib/api-client";

export const journalApi = {
  list: () => apiClient.get<JournalEntriesResponse>("/journal"),
  create: (input: CreateJournalEntryInput) =>
    apiClient.post<JournalEntryResponse>("/journal", input),
  update: ({ id, ...input }: UpdateJournalEntryInput & { id: string }) =>
    apiClient.patch<JournalEntryResponse>(`/journal/${id}`, input),
  remove: (id: string) => apiClient.delete<void>(`/journal/${id}`),
};
