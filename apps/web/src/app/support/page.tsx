import { BackLink } from "@/components/back-link";
import { SupportFormLoader } from "./support-form-loader";

export const metadata = { title: "Get in touch — Better Days" };

/**
 * Both account-menu entries land here; "Report a bug" arrives with `?topic=bug`
 * preselected. One screen rather than two, because the difference between a bug
 * and a note is a sentence, not a workflow.
 */
export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-5 md:p-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center">
        <BackLink href="/dashboard" label="Back to dashboard" />
        <h1 className="text-center font-heading text-2xl font-bold text-primary">
          Get in touch
        </h1>
        <span aria-hidden className="size-12" />
      </header>

      <p className="text-center text-muted-foreground">
        Something broken, something missing, or something you want to say. It
        goes to the person who built this.
      </p>

      <SupportFormLoader initialTopic={topic === "bug" ? "bug" : "message"} />

      <p className="text-center text-xs text-muted-foreground">
        Your message is delivered by email through Web3Forms. Nothing from your
        journal, check-ins, or history is attached — only what you write and the
        reply address you choose to leave.
      </p>
    </main>
  );
}
