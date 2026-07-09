"use client";

import type { ResolveUrgeInput } from "@better-days/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DASHBOARD_QUERY_KEY } from "@/features/dashboard/hooks/use-dashboard";
import { urgesApi } from "../api";

export const URGES_QUERY_KEY = ["urges"] as const;

/** Invalidating `["urges"]` also invalidates every single-urge query beneath it. */
export const urgeQueryKey = (id: string) => [...URGES_QUERY_KEY, id] as const;

export function useUrges() {
  return useQuery({
    queryKey: URGES_QUERY_KEY,
    queryFn: urgesApi.list,
    retry: false,
  });
}

export function useUrge(id: string) {
  return useQuery({
    queryKey: urgeQueryKey(id),
    queryFn: () => urgesApi.get(id),
    retry: false,
  });
}

export function useCreateUrge() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: urgesApi.create,
    onSuccess: ({ urge }) => {
      void queryClient.invalidateQueries({ queryKey: URGES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      // Straight into riding it out. The urge is happening now, and a history
      // list is no help in the middle of one.
      router.push(`/urges/${urge.id}/ride`);
    },
  });
}

/**
 * Records how an urge ended.
 *
 * Saying "I gambled" always routes on to the setback form: the moment someone
 * is honest with us is the moment to make logging it effortless, not to send
 * them hunting through the nav. Callers handle the `passed` case, which differs
 * by screen.
 */
export function useResolveUrge(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: ResolveUrgeInput) => urgesApi.resolve(id, input),
    onSuccess: (_data, input) => {
      void queryClient.invalidateQueries({ queryKey: URGES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });

      if (input.outcome === "gambled") {
        toast("Thank you for coming back to tell us.", {
          description: "Let's log it and keep going.",
        });
        router.push("/relapses/new");
        return;
      }

      toast.success("You rode it out.", {
        description: "That is the skill. It gets easier every time.",
      });
    },
  });
}
