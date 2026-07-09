import { BackLink } from "@/components/back-link";
import { UrgeForm } from "@/features/urges/components/urge-form";

export const metadata = { title: "Track an Urge — Better Days" };

export default function NewUrgePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-5 md:p-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center">
        <BackLink href="/urges" label="Back to your urges" />
        <h1 className="text-center font-heading text-2xl font-bold text-primary">
          Track an Urge
        </h1>
        <span aria-hidden className="size-12" />
      </header>
      <UrgeForm />
    </main>
  );
}
