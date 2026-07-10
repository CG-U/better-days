import { z } from "zod";

/**
 * This schema stays here rather than in `packages/shared`, which holds the
 * contracts between our web app and our API. A support message never reaches
 * our API — it goes straight from the browser to Web3Forms — so there is no
 * second consumer to keep in step with.
 */
export const SUPPORT_TOPICS = ["bug", "message"] as const;

export type SupportTopic = (typeof SUPPORT_TOPICS)[number];

export const SUPPORT_MESSAGE_MAX = 2000;

export const SupportMessageSchema = z.object({
  topic: z.enum(SUPPORT_TOPICS),
  /**
   * Prefilled from the signed-in account, but optional: this address leaves the
   * app for a third-party form service, and clearing the field must be enough
   * to send a message that carries no identity with it.
   */
  replyTo: z
    .union([z.string().email("Enter a valid email address"), z.literal("")])
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, "A sentence or two is enough — just tell us what happened")
    .max(
      SUPPORT_MESSAGE_MAX,
      `Keep it under ${SUPPORT_MESSAGE_MAX} characters`,
    ),
});

export type SupportMessageInput = z.infer<typeof SupportMessageSchema>;
