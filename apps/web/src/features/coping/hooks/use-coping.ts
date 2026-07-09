"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { copingApi } from "../api";

export const COPING_QUERY_KEY = ["coping"] as const;

export function useCopingStrategies() {
  return useQuery({
    queryKey: COPING_QUERY_KEY,
    queryFn: copingApi.list,
    retry: false,
  });
}

export function useCreateCopingStrategy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: copingApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: COPING_QUERY_KEY });
      toast.success("Added to your toolkit.");
    },
  });
}

export function useDeleteCopingStrategy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: copingApi.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: COPING_QUERY_KEY });
      toast.success("Removed from your toolkit.");
    },
  });
}

/**
 * Marking a strategy helpful is the only thing that reorders the toolkit, so it
 * refetches. No navigation: the user is mid-craving and stays where they are.
 */
export function useMarkCopingStrategyHelped() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: copingApi.markHelped,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: COPING_QUERY_KEY });
      toast.success("Good. We'll keep that one close to hand.");
    },
  });
}
