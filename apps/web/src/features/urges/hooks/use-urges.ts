"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DASHBOARD_QUERY_KEY } from "@/features/dashboard/hooks/use-dashboard";
import { urgesApi } from "../api";

export const URGES_QUERY_KEY = ["urges"] as const;

export function useUrges() {
  return useQuery({
    queryKey: URGES_QUERY_KEY,
    queryFn: urgesApi.list,
    retry: false,
  });
}

export function useCreateUrge() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: urgesApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: URGES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      router.push("/urges");
    },
  });
}
