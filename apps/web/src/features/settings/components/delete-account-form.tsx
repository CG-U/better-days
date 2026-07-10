"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DeleteAccountSchema,
  type DeleteAccountInput,
} from "@better-days/shared";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteAccount } from "../hooks/use-settings";

/**
 * Deleting an account is the one place `destructive` (red) is correct: it is a
 * genuine warning about losing data, not a judgement about the person. Setbacks
 * use `warning` precisely so that red still means something when it appears.
 *
 * The password field stays hidden until the user asks for it. A password box
 * sitting under a red heading invites a mistap; two deliberate steps do not.
 */
export function DeleteAccountForm() {
  const [confirming, setConfirming] = useState(false);
  const deleteAccount = useDeleteAccount();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: { password: "" },
  });

  function cancel() {
    reset();
    deleteAccount.reset();
    setConfirming(false);
  }

  return (
    <SectionCard className="space-y-4 border-destructive/30">
      <h2 className="font-heading text-xl font-semibold text-destructive">
        Delete account
      </h2>
      <p className="text-sm text-muted-foreground">
        This removes your streak, urges, setbacks, check-ins, coping toolkit,
        and every journal entry. It cannot be undone, and we keep no copy.
      </p>

      {!confirming ? (
        <Button
          type="button"
          size="lg"
          variant="destructive"
          className="w-full rounded-full"
          onClick={() => setConfirming(true)}
        >
          Delete my account
        </Button>
      ) : (
        <form
          onSubmit={handleSubmit((values) => deleteAccount.mutate(values))}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-3">
            <Label htmlFor="deletePassword">
              Enter your password to confirm
            </Label>
            <Input
              id="deletePassword"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <FormError message={errors.password?.message} />
          </div>

          <FormError message={deleteAccount.error?.message} />

          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            {/* Reversed on desktop so "Keep my account" is the leftmost, and
                the pointer's resting place is not the irreversible button. */}
            <Button
              type="submit"
              size="lg"
              variant="destructive"
              className="w-full rounded-full sm:flex-1"
              disabled={deleteAccount.isPending}
            >
              {deleteAccount.isPending
                ? "Deleting..."
                : "Permanently delete everything"}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="w-full rounded-full sm:flex-1"
              onClick={cancel}
              disabled={deleteAccount.isPending}
            >
              Keep my account
            </Button>
          </div>
        </form>
      )}
    </SectionCard>
  );
}
