"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
    },
  });
}
