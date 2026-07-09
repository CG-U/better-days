"use client";

import { Sparkles, Trash2, Wrench } from "lucide-react";
import { FormError } from "@/components/form-error";
import { QueryError } from "@/components/query-error";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCopingStrategies,
  useDeleteCopingStrategy,
} from "../hooks/use-coping";

/** The toolkit as a manageable list — ordered by what has actually worked. */
export function CopingList() {
  const strategies = useCopingStrategies();
  const deleteStrategy = useDeleteCopingStrategy();

  if (strategies.isPending) {
    return (
      <div className="grid gap-3 sm:grid-cols-2" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (strategies.isError) {
    return (
      <QueryError
        message="We could not load your toolkit."
        onRetry={() => void strategies.refetch()}
        isRetrying={strategies.isFetching}
      />
    );
  }

  if (strategies.data.strategies.length === 0) {
    return (
      <SectionCard className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary-container/40 text-on-primary-container">
          <Wrench aria-hidden className="size-6" />
        </span>
        <div className="space-y-1">
          <p className="font-heading text-xl font-semibold">Nothing here yet.</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Even one entry is worth having. You are writing this now so that you
            do not have to think of it later, when thinking is hard.
          </p>
        </div>
      </SectionCard>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="grid gap-3 sm:grid-cols-2">
        {strategies.data.strategies.map((strategy) => (
          <li
            key={strategy.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card py-3 pr-2 pl-5 shadow-card"
          >
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-medium">{strategy.label}</span>
              {strategy.helpedCount > 0 ? (
                <span className="flex items-center gap-1.5 text-xs text-primary">
                  <Sparkles aria-hidden className="size-3.5" />
                  Helped {strategy.helpedCount}{" "}
                  {strategy.helpedCount === 1 ? "time" : "times"}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Not used yet
                </span>
              )}
            </span>

            <Button
              variant="ghost"
              size="icon-lg"
              aria-label={`Remove "${strategy.label}" from your toolkit`}
              disabled={
                deleteStrategy.isPending &&
                deleteStrategy.variables === strategy.id
              }
              onClick={() => deleteStrategy.mutate(strategy.id)}
            >
              <Trash2 aria-hidden className="size-5 text-muted-foreground" />
            </Button>
          </li>
        ))}
      </ul>

      <FormError message={deleteStrategy.error?.message} />
    </div>
  );
}
