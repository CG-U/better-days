import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelapseList } from "@/features/relapses/components/relapse-list";

export const metadata = { title: "Setbacks — Better Days" };

export default function RelapsesPage() {
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
          Setbacks
        </h1>
        <span aria-hidden className="size-10" />
      </header>
      <p className="text-center text-muted-foreground">
        Every day is another opportunity to make progress. Setbacks are part of
        the journey, not the end of it.
      </p>
      <Button
        render={<Link href="/relapses/new" />}
        variant="outline"
        className="h-12 w-full rounded-full border-primary text-primary"
      >
        <Plus aria-hidden className="size-5" />
        Log a setback
      </Button>
      <RelapseList />
    </main>
  );
}
