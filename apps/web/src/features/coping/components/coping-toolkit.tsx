"use client";

import { Check, Wrench } from "lucide-react";
import Link from "next/link";
import { QueryError } from "@/components/query-error";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCopingStrategies,
  useMarkCopingStrategyHelped,
} from "../hooks/use-coping";

/**
 * The user's own coping strategies, in their own words, shown while they ride
 * out an urge. Sorted most-helpful-first by the server, so the thing that
 * actually works for them rises without any curation on their part.
 */
export function CopingToolkit() {
  const strategies = useCopingStrategies();
  const markHelped = useMarkCopingStrategyHelped();

  if (strategies.isPending) {
    return <Skeleton className="h-40 rounded-2xl" aria-hidden />;
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
      <SectionCard className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary-container/40 text-on-primary-container">
          <Wrench aria-hidden className="size-6" />
        </span>
        <div className="space-y-1">
          <p className="font-heading text-xl font-semibold">
            Your toolkit is empty.
          </p>
          <p className="text-sm text-muted-foreground">
            When things are calm, write down what helps you. It will be waiting
            here the next time it isn&apos;t.
          </p>
        </div>
        <Button
          render={<Link href="/settings" />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="rounded-full"
        >
          Build your toolkit
        </Button>
      </SectionCard>
    );
  }

  return (
    <SectionCard className="flex flex-col gap-4">
      <div className="space-y-1">
        <h2 className="font-heading text-xl font-semibold">
          Things that help you
        </h2>
        <p className="text-sm text-muted-foreground">
          Pick one. Tell us afterwards if it worked.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {strategies.data.strategies.map((strategy) => (
          <li key={strategy.id}>
            <button
              type="button"
              // `variables` is the id currently in flight — only that row waits.
              disabled={
                markHelped.isPending && markHelped.variables === strategy.id
              }
              onClick={() => markHelped.mutate(strategy.id)}
              className="focus-ring flex min-h-12 w-full items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-3 text-left transition-colors duration-200 ease-in-out hover:border-primary/50 hover:bg-primary-container/20 disabled:opacity-50"
            >
              <span className="font-medium">{strategy.label}</span>
              <span className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                <Check aria-hidden className="size-4" />
                This helped
              </span>
            </button>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
