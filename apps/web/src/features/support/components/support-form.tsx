"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bug, MessageCircle, Send } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FormError } from "@/components/form-error";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supportIsConfigured } from "../api";
import {
  SUPPORT_MESSAGE_MAX,
  SupportMessageSchema,
  type SupportMessageInput,
  type SupportTopic,
} from "../schema";
import { useSendSupportMessage } from "../hooks/use-support";

const TOPICS: {
  value: SupportTopic;
  label: string;
  icon: typeof Bug;
  placeholder: string;
}[] = [
  {
    value: "bug",
    label: "Report a bug",
    icon: Bug,
    placeholder:
      "What happened, what you expected instead, and where in the app you were.",
  },
  {
    value: "message",
    label: "Contact the developer",
    icon: MessageCircle,
    placeholder:
      "Anything at all — an idea, a word that landed wrong, something that helped.",
  },
];

/** Shown only near the cap: a live count over a blank box reads as a target. */
const COUNTER_THRESHOLD = 200;

export function SupportForm({
  initialTopic,
  defaultReplyTo = "",
}: {
  initialTopic: SupportTopic;
  /** The signed-in account's email, injected by the page. Editable and erasable. */
  defaultReplyTo?: string;
}) {
  const send = useSendSupportMessage();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupportMessageInput>({
    resolver: zodResolver(SupportMessageSchema),
    defaultValues: {
      topic: initialTopic,
      replyTo: defaultReplyTo,
      message: "",
    },
  });

  const topic = useWatch({ control, name: "topic" });
  const message = useWatch({ control, name: "message" });
  const remaining = SUPPORT_MESSAGE_MAX - message.length;
  const active = TOPICS.find((entry) => entry.value === topic) ?? TOPICS[0];

  return (
    <SectionCard>
      <form
        onSubmit={handleSubmit((values) =>
          send.mutate(values, {
            // Keep the topic and the address they chose; only clear the message.
            onSuccess: () =>
              reset({
                topic: values.topic,
                replyTo: values.replyTo,
                message: "",
              }),
          }),
        )}
        className="space-y-5"
        noValidate
      >
        <Controller
          control={control}
          name="topic"
          render={({ field }) => (
            <div
              role="radiogroup"
              aria-label="What is this about?"
              className="flex flex-col gap-2 sm:flex-row"
            >
              {TOPICS.map((entry) => {
                const selected = field.value === entry.value;
                return (
                  <button
                    key={entry.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => field.onChange(entry.value)}
                    className={cn(
                      "focus-ring flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors duration-200 ease-in-out",
                      selected
                        ? "border-primary bg-primary-container/50 text-on-primary-container"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50",
                    )}
                  >
                    <entry.icon aria-hidden className="size-4" />
                    {entry.label}
                  </button>
                );
              })}
            </div>
          )}
        />

        {/* Above the message on purpose: it is prefilled, so it reads as
            settled context rather than a question waiting at the end. Deciding
            whether to sign a message is also easier before writing it than
            after. */}
        <div className="space-y-3">
          <Label htmlFor="replyTo">Reply to</Label>
          <Input
            id="replyTo"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.replyTo}
            {...register("replyTo")}
          />
          <p className="text-xs text-muted-foreground">
            Filled in from your account so we can write back. Change it, or
            clear it to send this anonymously.
          </p>
          <FormError message={errors.replyTo?.message} />
        </div>

        <div className="space-y-3">
          <Label htmlFor="message">Your message</Label>
          <Textarea
            id="message"
            rows={7}
            placeholder={active.placeholder}
            aria-invalid={!!errors.message}
            {...register("message")}
          />
          <div className="flex items-start justify-between gap-4">
            <FormError message={errors.message?.message} />
            {remaining <= COUNTER_THRESHOLD ? (
              <span
                className={cn(
                  "shrink-0 text-xs tabular-nums",
                  remaining < 0 ? "text-warning" : "text-muted-foreground",
                )}
              >
                {remaining}
              </span>
            ) : null}
          </div>
        </div>

        <FormError message={send.error?.message} />

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full"
          disabled={send.isPending || !supportIsConfigured}
        >
          <Send aria-hidden className="size-5" />
          {send.isPending ? "Sending..." : "Send"}
        </Button>

        {!supportIsConfigured ? (
          <p className="text-center text-sm text-muted-foreground">
            Messages aren&apos;t set up on this build yet.
          </p>
        ) : null}
      </form>
    </SectionCard>
  );
}
