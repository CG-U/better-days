"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dashboardApi } from "../api";

export const DASHBOARD_QUERY_KEY = ["dashboard"] as const;

export function useDashboard() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: dashboardApi.get,
    retry: false,
  });
}

export function useSaveRecovery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dashboardApi.saveRecovery,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      toast.success("Your dashboard is ready", {
        description: "Every day from here is progress worth tracking.",
      });
    },
  });
}
