"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordSchema,
  type ChangePasswordInput,
} from "@better-days/shared";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "../hooks/use-settings";

export function PasswordForm() {
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        changePassword.mutate(values, { onSuccess: () => reset() }),
      )}
      className="flex flex-col gap-5"
      noValidate
    >
      <SectionCard className="space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound aria-hidden className="size-5 text-secondary" />
          <h2 className="font-heading text-xl font-semibold">Password</h2>
        </div>

        <div className="space-y-3">
          <Label htmlFor="currentPassword">Current password</Label>
          <Input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.currentPassword}
            {...register("currentPassword")}
          />
          <FormError message={errors.currentPassword?.message} />
        </div>

        <div className="space-y-3">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            {...register("newPassword")}
          />
          <p className="text-xs text-muted-foreground">
            At least 8 characters.
          </p>
          <FormError message={errors.newPassword?.message} />
        </div>

        <FormError message={changePassword.error?.message} />

        <Button
          type="submit"
          size="lg"
          variant="outline"
          className="w-full rounded-full border-primary text-primary"
          disabled={changePassword.isPending}
        >
          {changePassword.isPending ? "Updating..." : "Change password"}
        </Button>
      </SectionCard>
    </form>
  );
}
