"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateJournalEntrySchema,
  JOURNAL_BODY_MAX,
  type CreateJournalEntryInput,
} from "@better-days/shared";
import { useForm, useWatch } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateJournalEntry } from "../hooks/use-journal";

/**
 * Prompts, not questions with right answers. They are placeholder text — the
 * page never insists you answer one, and an empty journal is not a failed one.
 */
const PLACEHOLDER =
  "Whatever is on your mind. What today felt like, what you noticed, what you want to remember.";

export function JournalComposer() {
  const createEntry = useCreateJournalEntry();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateJournalEntryInput>({
    resolver: zodResolver(CreateJournalEntrySchema),
    defaultValues: { body: "" },
  });

  // useWatch, not watch(): the latter returns an unmemoizable function and
  // opts the whole component out of the React Compiler.
  const body = useWatch({ control, name: "body" });
  const remaining = JOURNAL_BODY_MAX - body.length;

  return (
    <SectionCard>
      <form
        onSubmit={handleSubmit((values) =>
          createEntry.mutate(values, { onSuccess: () => reset() }),
        )}
        className="space-y-4"
        noValidate
      >
        <div className="space-y-1">
          <Label htmlFor="body" className="text-xl font-semibold">
            Write it down
          </Label>
          <p className="text-sm text-muted-foreground">
            Nothing here is measured or scored. It is yours.
          </p>
        </div>

        <Textarea
          id="body"
          rows={7}
          placeholder={PLACEHOLDER}
          aria-invalid={!!errors.body}
          className="resize-y"
          {...register("body")}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Only counts down near the cap: a live counter over a blank page
              reads as a word target, and this is not an assignment. */}
          <p className="text-xs text-muted-foreground">
            {remaining <= 200
              ? `${remaining} character${remaining === 1 ? "" : "s"} left`
              : ""}
          </p>
          <Button
            type="submit"
            size="lg"
            className="rounded-full"
            disabled={createEntry.isPending || body.trim().length === 0}
          >
            {createEntry.isPending ? "Saving..." : "Save entry"}
          </Button>
        </div>

        <FormError message={errors.body?.message} />
        <FormError message={createEntry.error?.message} />
      </form>
    </SectionCard>
  );
}
