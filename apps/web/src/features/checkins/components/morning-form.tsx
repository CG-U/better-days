"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  MorningCheckInSchema,
  type CheckIn,
  type MorningCheckInInput,
} from "@better-days/shared";
import { CircleCheck, Sun } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSaveCheckIn } from "../hooks/use-checkins";

const MOODS = [
  { value: 1, emoji: "😔", label: "Down" },
  { value: 2, emoji: "😐", label: "Okay" },
  { value: 3, emoji: "😊", label: "Good" },
  { value: 4, emoji: "🤩", label: "Great" },
  { value: 5, emoji: "😌", label: "Calm" },
] as const;

const STRESS_WORDS = ["Very low", "Low", "Moderate", "High", "Very high"];

const SLEEP_WORDS = ["Poor", "Restless", "Fair", "Good", "Restorative"];

/** Maps 1–10 sleep quality onto a descriptive word for screen readers. */
function sleepWord(value: number): string {
  return SLEEP_WORDS[Math.min(Math.ceil(value / 2), SLEEP_WORDS.length) - 1];
}

export function MorningForm({
  date,
  existing,
}: {
  date: string;
  existing: CheckIn | null;
}) {
  const saveCheckIn = useSaveCheckIn();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MorningCheckInInput>({
    resolver: zodResolver(MorningCheckInSchema),
    defaultValues: {
      period: "morning",
      date,
      mood: existing?.mood ?? undefined,
      sleepQuality: existing?.sleepQuality ?? 5,
      stressLevel: existing?.stressLevel ?? undefined,
      intention: existing?.intention ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => saveCheckIn.mutate(values))}
      className="flex flex-col gap-5"
      noValidate
    >
      <SectionCard>
        <Controller
          control={control}
          name="mood"
          render={({ field }) => (
            <fieldset className="space-y-4">
              <legend className="flex items-center gap-2 text-xl font-semibold">
                <Sun aria-hidden className="size-5 text-primary" />
                Morning mood
              </legend>
              <div className="flex justify-between gap-1">
                {MOODS.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    aria-pressed={field.value === mood.value}
                    onClick={() => field.onChange(mood.value)}
                    className={cn(
                      "focus-ring flex min-h-12 flex-1 flex-col items-center gap-1 rounded-xl p-2 transition-colors duration-200 ease-in-out",
                      field.value === mood.value
                        ? "bg-primary-container/40"
                        : "hover:bg-muted",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "text-3xl",
                        field.value === mood.value ? "" : "grayscale",
                      )}
                    >
                      {mood.emoji}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-bold",
                        field.value === mood.value
                          ? "text-on-primary-container"
                          : "text-muted-foreground",
                      )}
                    >
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        />
        <FormError message={errors.mood?.message} />
      </SectionCard>

      <SectionCard>
        <Controller
          control={control}
          name="sleepQuality"
          render={({ field }) => (
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="sleepQuality" className="text-xl font-semibold">
                  Sleep quality
                </Label>
                <p className="font-heading text-2xl font-bold text-secondary">
                  {field.value}/10
                </p>
              </div>
              <input
                id="sleepQuality"
                type="range"
                min={1}
                max={10}
                step={1}
                aria-valuetext={`${field.value} out of 10 — ${sleepWord(field.value)}`}
                className="focus-ring h-6 w-full accent-primary"
                value={field.value}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
              <div className="label-caps flex justify-between text-muted-foreground">
                <span>Poor</span>
                <span>Restorative</span>
              </div>
            </div>
          )}
        />
        <FormError message={errors.sleepQuality?.message} />
      </SectionCard>

      <SectionCard>
        <Controller
          control={control}
          name="stressLevel"
          render={({ field }) => (
            <fieldset className="space-y-4">
              <legend className="flex w-full items-center justify-between text-xl font-semibold">
                Stress level
                {field.value ? (
                  <span className="label-caps rounded-full bg-warning-container px-3 py-1 text-on-warning-container">
                    {STRESS_WORDS[field.value - 1]}
                  </span>
                ) : null}
              </legend>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    aria-pressed={field.value === level}
                    onClick={() => field.onChange(level)}
                    className={cn(
                      "focus-ring min-h-12 flex-1 rounded-xl border font-semibold transition-colors duration-200 ease-in-out",
                      field.value === level
                        ? "border-primary bg-primary-container/40 text-on-primary-container"
                        : "border-transparent bg-muted hover:border-primary/40",
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        />
        <FormError message={errors.stressLevel?.message} />
      </SectionCard>

      <SectionCard>
        <div className="space-y-3">
          <Label htmlFor="intention" className="text-xl font-semibold">
            Daily intention
          </Label>
          <Textarea
            id="intention"
            placeholder="What's one small thing you'd like to focus on today?"
            aria-invalid={!!errors.intention}
            {...register("intention")}
          />
          <FormError message={errors.intention?.message} />
        </div>
      </SectionCard>

      <FormError message={saveCheckIn.error?.message} />

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full"
        disabled={saveCheckIn.isPending}
      >
        <CircleCheck aria-hidden className="size-5" />
        {saveCheckIn.isPending
          ? "Saving..."
          : existing
            ? "Update morning entry"
            : "Save morning entry"}
      </Button>
      {existing ? (
        <p className="text-center text-xs text-muted-foreground">
          Saved for today — you can update it anytime.
        </p>
      ) : null}
    </form>
  );
}
