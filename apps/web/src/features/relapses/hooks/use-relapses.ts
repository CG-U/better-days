"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DASHBOARD_QUERY_KEY } from "@/features/dashboard/hooks/use-dashboard";
import { relapsesApi } from "../api";

export const RELAPSES_QUERY_KEY = ["relapses"] as const;

export function useRelapses() {
  return useQuery({
    queryKey: RELAPSES_QUERY_KEY,
    queryFn: relapsesApi.list,
    retry: false,
  });
}

export function useCreateRelapse() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: relapsesApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RELAPSES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      toast.success("Setback recorded", {
        description: "Logging it honestly is part of moving forward.",
      });
      router.push("/relapses");
    },
  });
}
