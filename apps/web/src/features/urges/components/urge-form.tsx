"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUrgeSchema,
  TRIGGERS,
  type CreateUrgeInput,
} from "@better-days/shared";
import { CircleCheck, Wind } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { SectionCard } from "@/components/section-card";
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
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-container/50 text-on-primary-container">
          <Wind aria-hidden className="size-6" />
        </span>
        <div>
          <p className="label-caps text-on-primary-container">Supportive tip</p>
          <p className="text-foreground">
            Take a deep breath. This moment will pass.
          </p>
        </div>
      </div>

      <SectionCard>
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
                aria-valuetext={`${field.value} out of 10 — ${intensityWord(field.value)}`}
                className="focus-ring h-6 w-full accent-primary"
                value={field.value}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
              <div className="label-caps flex justify-between text-muted-foreground">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>
          )}
        />
        <FormError message={errors.intensity?.message} />
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
      </SectionCard>

      <FormError message={createUrge.error?.message} />

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full"
        disabled={createUrge.isPending}
      >
        <CircleCheck aria-hidden className="size-5" />
        {createUrge.isPending ? "Saving..." : "Save entry"}
      </Button>
    </form>
  );
}
