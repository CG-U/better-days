"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  COPING_STRATEGY_MAX,
  CreateCopingStrategySchema,
  type CreateCopingStrategyInput,
} from "@better-days/shared";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCopingStrategies,
  useCreateCopingStrategy,
} from "../hooks/use-coping";

const SUGGESTIONS = [
  "Call my brother",
  "Walk around the block",
  "Ten slow breaths",
  "Text someone who knows",
];

export function CopingAddForm() {
  const strategies = useCopingStrategies();
  const createStrategy = useCreateCopingStrategy();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateCopingStrategyInput>({
    resolver: zodResolver(CreateCopingStrategySchema),
    defaultValues: { label: "" },
  });

  const isFull =
    strategies.isSuccess &&
    strategies.data.strategies.length >= COPING_STRATEGY_MAX;

  return (
    <SectionCard>
      <form
        onSubmit={handleSubmit((values) =>
          createStrategy.mutate(values, { onSuccess: () => reset() }),
        )}
        className="space-y-4"
        noValidate
      >
        <div className="space-y-1">
          <Label htmlFor="label" className="text-xl font-semibold">
            Add something that helps
          </Label>
          <p className="text-sm text-muted-foreground">
            In your own words. Short enough to read in one glance.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="label"
            placeholder="Call my brother"
            aria-invalid={!!errors.label}
            disabled={isFull}
            {...register("label")}
          />
          <Button
            type="submit"
            size="lg"
            className="shrink-0 rounded-full"
            disabled={createStrategy.isPending || isFull}
          >
            <Plus aria-hidden className="size-5" />
            {createStrategy.isPending ? "Adding..." : "Add"}
          </Button>
        </div>

        <FormError message={errors.label?.message} />
        <FormError message={createStrategy.error?.message} />

        {isFull ? (
          <p className="text-sm text-muted-foreground">
            Your toolkit is full at {COPING_STRATEGY_MAX}. Remove one to add
            another — a short list is one you can actually use.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="label-caps text-muted-foreground">
              Need a start?
            </span>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                // Fills the field rather than saving: the words should be theirs,
                // and a suggestion they edit is likelier to work than one they took.
                onClick={() =>
                  setValue("label", suggestion, { shouldValidate: true })
                }
                className="focus-ring min-h-12 rounded-full border border-border bg-card px-4 text-sm transition-colors duration-200 ease-in-out hover:border-primary/50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </form>
    </SectionCard>
  );
}
