"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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

/**
 * The API clears the session cookie, so the only work left here is discarding
 * the cached copies of data that no longer exists. `replace`, not `push`: the
 * back button must not return to a dashboard belonging to a deleted account.
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: settingsApi.deleteAccount,
    onSuccess: () => {
      queryClient.clear();
      router.replace("/login");
      // No "success" tone. Leaving is not a failure and not an achievement.
      toast("Your account has been deleted.", {
        description: "Everything you wrote is gone. Take good care of yourself.",
      });
    },
  });
}
