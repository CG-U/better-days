"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { journalApi } from "../api";

export const JOURNAL_QUERY_KEY = ["journal"] as const;
const DASHBOARD_QUERY_KEY = ["dashboard"] as const;

export function useJournalEntries() {
  return useQuery({
    queryKey: JOURNAL_QUERY_KEY,
    queryFn: journalApi.list,
    retry: false,
  });
}

/** Writing an entry adds a line to the dashboard feed, so both keys refresh. */
export function useCreateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: journalApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      toast.success("Saved.", { description: "Thank you for writing it down." });
    },
  });
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: journalApi.update,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEY });
      toast.success("Updated.");
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: journalApi.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      toast.success("Entry deleted.");
    },
  });
}
