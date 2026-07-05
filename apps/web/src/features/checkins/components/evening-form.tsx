"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  EveningCheckInSchema,
  type CheckIn,
  type EveningCheckInInput,
} from "@better-days/shared";
import { CircleCheck, Moon } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSaveCheckIn } from "../hooks/use-checkins";

export function EveningForm({
  date,
  existing,
}: {
  date: string;
  existing: CheckIn | null;
}) {
  const saveCheckIn = useSaveCheckIn();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EveningCheckInInput>({
    resolver: zodResolver(EveningCheckInSchema),
    defaultValues: {
      period: "evening",
      date,
      urgesToday: existing?.urgesToday ?? undefined,
      reflection: existing?.reflection ?? "",
      gratitude: existing?.gratitude ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => saveCheckIn.mutate(values))}
      className="flex flex-col gap-5"
      noValidate
    >
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-3">
          <Label
            htmlFor="urgesToday"
            className="flex items-center gap-2 text-xl font-semibold"
          >
            <Moon aria-hidden className="size-5 text-secondary" />
            Urges today
          </Label>
          <p className="text-sm text-muted-foreground">
            How many urges did you notice today? Noticing them is a skill.
          </p>
          <Input
            id="urgesToday"
            type="number"
            inputMode="numeric"
            min="0"
            max="99"
            placeholder="0"
            className="max-w-32"
            aria-invalid={!!errors.urgesToday}
            {...register("urgesToday", { valueAsNumber: true })}
          />
          <FormError message={errors.urgesToday?.message} />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-3">
          <Label htmlFor="reflection" className="text-xl font-semibold">
            Reflection
          </Label>
          <Textarea
            id="reflection"
            placeholder="How did today go? Wins count, however small..."
            aria-invalid={!!errors.reflection}
            {...register("reflection")}
          />
          <FormError message={errors.reflection?.message} />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-3">
          <Label htmlFor="gratitude" className="text-xl font-semibold">
            Gratitude
          </Label>
          <Textarea
            id="gratitude"
            placeholder="One thing you're grateful for today..."
            aria-invalid={!!errors.gratitude}
            {...register("gratitude")}
          />
          <FormError message={errors.gratitude?.message} />
        </div>
      </section>

      <FormError message={saveCheckIn.error?.message} />

      <Button
        type="submit"
        className="h-12 w-full rounded-full"
        disabled={saveCheckIn.isPending}
      >
        <CircleCheck aria-hidden className="size-5" />
        {saveCheckIn.isPending
          ? "Saving..."
          : existing
            ? "Update evening entry"
            : "Save evening entry"}
      </Button>
      {existing ? (
        <p className="text-center text-xs text-muted-foreground">
          Saved for today — you can update it anytime.
        </p>
      ) : null}
    </form>
  );
}
