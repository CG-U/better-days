"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DASHBOARD_QUERY_KEY } from "@/features/dashboard/hooks/use-dashboard";
import { checkInsApi } from "../api";

export const CHECKINS_QUERY_KEY = ["checkins"] as const;

export function useCheckInDay(date: string | null) {
  return useQuery({
    queryKey: [...CHECKINS_QUERY_KEY, "day", date],
    queryFn: () => checkInsApi.day(date as string),
    enabled: date !== null,
    retry: false,
  });
}

export function useSaveCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkInsApi.save,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: CHECKINS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      toast.success(
        variables.period === "morning"
          ? "Morning check-in saved"
          : "Evening check-in saved",
        { description: "Thank you for showing up today." },
      );
    },
  });
}
