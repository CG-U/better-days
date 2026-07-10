"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendSupportMessage } from "../api";

/**
 * No query key and no cache: a support message is fire-and-forget. Nothing in
 * the app reads it back, and we deliberately keep no record of it locally.
 */
export function useSendSupportMessage() {
  return useMutation({
    mutationFn: sendSupportMessage,
    onSuccess: () => {
      toast.success("Sent. Thank you — a person will read this.");
    },
  });
}
