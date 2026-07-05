import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RelapseForm } from "@/features/relapses/components/relapse-form";

export const metadata = { title: "Log a Setback — Better Days" };

export default function NewRelapsePage() {
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
          Log a Setback
        </h1>
        <span aria-hidden className="size-10" />
      </header>
      <RelapseForm />
    </main>
  );
}
