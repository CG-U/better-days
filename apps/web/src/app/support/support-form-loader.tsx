"use client";

import { useMe } from "@/features/auth/hooks/use-auth";
import { SupportForm } from "@/features/support/components/support-form";
import type { SupportTopic } from "@/features/support/schema";

/**
 * `features/support` must not reach into `features/auth`, so the account email
 * is handed to the form from here — cross-feature composition lives in `app/`.
 *
 * Keyed on the email because `/auth/me` resolves after the first paint, and a
 * remount is how React Hook Form's `defaultValues` pick up a value that arrives
 * late. The form renders immediately with a blank field rather than waiting.
 */
export function SupportFormLoader({
  initialTopic,
}: {
  initialTopic: SupportTopic;
}) {
  const me = useMe();
  const email = me.data?.user.email ?? "";

  return (
    <SupportForm
      key={email}
      initialTopic={initialTopic}
      defaultReplyTo={email}
    />
  );
}
