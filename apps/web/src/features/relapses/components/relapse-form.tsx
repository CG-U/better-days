"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateRelapseSchema,
  TRIGGERS,
  type CreateRelapseInput,
} from "@better-days/shared";
import { CircleCheck, HeartHandshake } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateRelapse } from "../hooks/use-relapses";

export function RelapseForm() {
  const createRelapse = useCreateRelapse();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRelapseInput>({
    resolver: zodResolver(CreateRelapseSchema),
    defaultValues: { notes: "" },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => createRelapse.mutate(values))}
      className="flex flex-col gap-5"
      noValidate
    >
      <div className="flex items-center gap-4 rounded-2xl bg-secondary-container/40 p-5">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary-container/60 text-on-secondary-container">
          <HeartHandshake aria-hidden className="size-6" />
        </span>
        <div>
          <p className="label-caps text-on-secondary-container">
            You are still on track
          </p>
          <p className="text-foreground">
            A setback does not erase your progress. Logging it is a brave,
            honest step.
          </p>
        </div>
      </div>

      <SectionCard>
        <div className="space-y-3">
          <Label htmlFor="amountSpent" className="text-xl font-semibold">
            How much was spent?
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted-foreground">
              $
            </span>
            <Input
              id="amountSpent"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              className="pl-8"
              aria-invalid={!!errors.amountSpent}
              {...register("amountSpent", { valueAsNumber: true })}
            />
          </div>
          <FormError message={errors.amountSpent?.message} />
        </div>
      </SectionCard>

      <SectionCard>
        <Controller
          control={control}
          name="trigger"
          render={({ field }) => (
            <fieldset className="space-y-4">
              <legend className="text-xl font-semibold">
                What triggered this?
              </legend>
              <div className="flex flex-wrap gap-2">
                {TRIGGERS.map((trigger) => (
                  <button
                    key={trigger}
                    type="button"
                    aria-pressed={field.value === trigger}
                    onClick={() => field.onChange(trigger)}
                    className={cn(
                      "focus-ring min-h-12 rounded-full border px-5 text-sm transition-colors duration-200 ease-in-out",
                      field.value === trigger
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary/50",
                    )}
                  >
                    {trigger}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        />
        <FormError message={errors.trigger?.message} />
      </SectionCard>

      <SectionCard>
        <div className="space-y-3">
          <Label htmlFor="notes" className="text-xl font-semibold">
            What happened?
          </Label>
          <Textarea
            id="notes"
            placeholder="No judgment here — noting the situation helps you spot patterns..."
            aria-invalid={!!errors.notes}
            {...register("notes")}
          />
          <FormError message={errors.notes?.message} />
        </div>
      </SectionCard>

      <FormError message={createRelapse.error?.message} />

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full"
        disabled={createRelapse.isPending}
      >
        <CircleCheck aria-hidden className="size-5" />
        {createRelapse.isPending ? "Saving..." : "Save and keep going"}
      </Button>
    </form>
  );
}
