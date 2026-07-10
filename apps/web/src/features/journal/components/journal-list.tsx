"use client";

import {
  JournalEntryBodySchema,
  type JournalEntry,
} from "@better-days/shared";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { FormError } from "@/components/form-error";
import { QueryError } from "@/components/query-error";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useDeleteJournalEntry,
  useJournalEntries,
  useUpdateJournalEntry,
} from "../hooks/use-journal";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const [draft, setDraft] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const updateEntry = useUpdateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  const isEditing = draft !== null;
  const parsed = isEditing ? JournalEntryBodySchema.safeParse(draft) : null;
  const edited = new Date(entry.updatedAt) > new Date(entry.createdAt);

  function save() {
    if (!parsed?.success) return;
    updateEntry.mutate(
      { id: entry.id, body: parsed.data },
      { onSuccess: () => setDraft(null) },
    );
  }

  return (
    <SectionCard className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium">
          {dateFormatter.format(new Date(entry.createdAt))}
        </p>
        {edited ? (
          <p className="text-xs text-muted-foreground">Edited</p>
        ) : null}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            rows={7}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Edit entry"
            className="resize-y"
          />
          <FormError
            message={parsed?.success ? undefined : parsed?.error.issues[0]?.message}
          />
          <FormError message={updateEntry.error?.message} />
          <div className="flex gap-2">
            <Button
              type="button"
              size="lg"
              className="rounded-full"
              onClick={save}
              disabled={updateEntry.isPending || !parsed?.success}
            >
              {updateEntry.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="ghost"
              className="rounded-full"
              onClick={() => setDraft(null)}
              disabled={updateEntry.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* pre-wrap: paragraph breaks are part of what someone wrote. */}
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {entry.body}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="lg"
              variant="ghost"
              className="rounded-full"
              onClick={() => setDraft(entry.body)}
            >
              <Pencil aria-hidden className="size-4" />
              Edit
            </Button>

            {confirmingDelete ? (
              <>
                <Button
                  type="button"
                  size="lg"
                  variant="destructive"
                  className="rounded-full"
                  onClick={() => deleteEntry.mutate(entry.id)}
                  disabled={deleteEntry.isPending}
                >
                  {deleteEntry.isPending ? "Deleting..." : "Delete for good"}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setConfirmingDelete(false)}
                  disabled={deleteEntry.isPending}
                >
                  Keep it
                </Button>
              </>
            ) : (
              <Button
                type="button"
                size="lg"
                variant="ghost"
                className="rounded-full text-muted-foreground"
                onClick={() => setConfirmingDelete(true)}
              >
                <Trash2 aria-hidden className="size-4" />
                Delete
              </Button>
            )}
          </div>
          <FormError message={deleteEntry.error?.message} />
        </>
      )}
    </SectionCard>
  );
}

export function JournalList() {
  const entries = useJournalEntries();

  if (entries.isPending) {
    return (
      <div className="space-y-4" aria-hidden>
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (entries.isError) {
    return (
      <QueryError
        message="We could not load your journal."
        onRetry={() => void entries.refetch()}
        isRetrying={entries.isFetching}
      />
    );
  }

  if (entries.data.entries.length === 0) {
    return (
      <SectionCard className="flex items-center gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-milestone-container/60 text-on-milestone-container">
          <BookOpen aria-hidden className="size-5" />
        </span>
        <p className="text-sm text-muted-foreground">
          Nothing written yet. There is no schedule to keep — write when you
          have something to say.
        </p>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-4">
      {entries.data.entries.map((entry) => (
        <JournalEntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
