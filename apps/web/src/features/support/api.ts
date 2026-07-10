import type { SupportMessageInput, SupportTopic } from "./schema";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/**
 * Web3Forms access keys are public by design — the key identifies the inbox to
 * deliver to, not the sender, so it ships to the browser like any other public
 * endpoint. It is read through `process.env` at build time, not at runtime.
 */
export const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

export const supportIsConfigured = WEB3FORMS_ACCESS_KEY.length > 0;

const SUBJECTS: Record<SupportTopic, string> = {
  bug: "Better Days — bug report",
  message: "Better Days — message from a user",
};

interface Web3FormsResponse {
  success: boolean;
  message: string;
}

/**
 * Posts straight to Web3Forms from the browser. Nothing about the message
 * touches our own API or database: the app holds a person's journal and their
 * relapse history, and a support inbox is the last place either belongs.
 */
export async function sendSupportMessage(
  input: SupportMessageInput,
): Promise<void> {
  if (!supportIsConfigured) {
    throw new Error(
      "Support messages aren't set up yet. Sorry — please try again later.",
    );
  }

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: SUBJECTS[input.topic],
      from_name: "Better Days",
      // Web3Forms uses `email` as the reply-to address. Omitted when blank, so
      // an anonymous report stays anonymous.
      ...(input.replyTo ? { email: input.replyTo } : {}),
      message: input.message,
    }),
  });

  const result = (await response.json()) as Web3FormsResponse;

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "We couldn't send that. Please try again.",
    );
  }
}
