import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { UrgeForm } from "@/features/urges/components/urge-form";

export const metadata = { title: "Track an Urge — Better Days" };

export default function NewUrgePage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 p-5 md:p-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center">
        <Link
          href="/dashboard"
          aria-label="Back to dashboard"
          className="rounded-full p-2 hover:bg-muted"
        >
          <ArrowLeft aria-hidden className="size-6" />
        </Link>
        <h1 className="text-center font-heading text-2xl font-bold text-primary">
          Track an Urge
        </h1>
        <span aria-hidden className="size-10" />
      </header>
      <UrgeForm />
    </main>
  );
}
