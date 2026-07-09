"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AUTH_QUERY_KEY } from "@/features/auth/hooks/use-auth";
import { settingsApi } from "../api";

export const PROFILE_QUERY_KEY = ["settings", "profile"] as const;

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: settingsApi.profile,
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      // The nav avatar and dashboard greeting read from ["auth","me"].
      void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success("Profile updated");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: settingsApi.changePassword,
    onSuccess: () => {
      toast.success("Password changed", {
        description: "Use your new password next time you sign in.",
      });
    },
  });
}
