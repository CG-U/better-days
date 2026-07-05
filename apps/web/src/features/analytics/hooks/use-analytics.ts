"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api";

export const ANALYTICS_QUERY_KEY = ["analytics"] as const;

export function useAnalytics() {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEY,
    queryFn: analyticsApi.get,
    retry: false,
  });
}
