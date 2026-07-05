"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUrgeSchema,
  URGE_TRIGGERS,
  type CreateUrgeInput,
} from "@better-days/shared";
import { CircleCheck, Wind } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateUrge } from "../hooks/use-urges";

function intensityWord(value: number): string {
  if (value <= 3) return "Mild";
  if (value <= 7) return "Moderate";
  return "Severe";
}

export function UrgeForm() {
  const createUrge = useCreateUrge();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUrgeInput>({
    resolver: zodResolver(CreateUrgeSchema),
    defaultValues: { intensity: 5, notes: "" },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => createUrge.mutate(values))}
      className="flex flex-col gap-5"
      noValidate
    >
      <div className="flex items-center gap-4 rounded-2xl bg-primary-container/30 p-5">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-container/50 text-primary">
          <Wind aria-hidden className="size-6" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Supportive tip
          </p>
          <p className="text-foreground">
            Take a deep breath. This moment will pass.
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <Controller
          control={control}
          name="intensity"
          render={({ field }) => (
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="intensity" className="text-xl font-semibold">
                  Intensity
                </Label>
                <p className="font-heading text-4xl font-extrabold text-primary">
                  {field.value}
                  <span className="sr-only"> out of 10 — </span>
                  <span className="ml-2 text-sm font-semibold text-muted-foreground">
                    {intensityWord(field.value)}
                  </span>
                </p>
              </div>
              <input
                id="intensity"
                type="range"
                min={1}
                max={10}
                step={1}
                className="w-full accent-primary"
                value={field.value}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>
          )}
        />
        <FormError message={errors.intensity?.message} />
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <Controller
          control={control}
          name="trigger"
          render={({ field }) => (
            <fieldset className="space-y-4">
              <legend className="text-xl font-semibold">
                What triggered this?
              </legend>
              <div className="flex flex-wrap gap-2">
                {URGE_TRIGGERS.map((trigger) => (
                  <button
                    key={trigger}
                    type="button"
                    aria-pressed={field.value === trigger}
                    onClick={() => field.onChange(trigger)}
                    className={cn(
                      "rounded-full border px-5 py-2.5 text-sm transition-colors",
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
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-3">
          <Label htmlFor="notes" className="text-xl font-semibold">
            Additional notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Describe how you're feeling or where you are..."
            aria-invalid={!!errors.notes}
            {...register("notes")}
          />
          <FormError message={errors.notes?.message} />
        </div>
      </section>

      <FormError message={createUrge.error?.message} />

      <Button
        type="submit"
        className="h-12 w-full rounded-full"
        disabled={createUrge.isPending}
      >
        <CircleCheck aria-hidden className="size-5" />
        {createUrge.isPending ? "Saving..." : "Save entry"}
      </Button>
    </form>
  );
}
