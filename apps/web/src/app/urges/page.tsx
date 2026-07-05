import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UrgeList } from "@/features/urges/components/urge-list";

export const metadata = { title: "Your Urges — Better Days" };

export default function UrgesPage() {
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
          Your Urges
        </h1>
        <span aria-hidden className="size-10" />
      </header>
      <p className="text-center text-muted-foreground">
        Every entry here is an urge you noticed and faced. That is progress.
      </p>
      <Button
        render={<Link href="/urges/new" />}
        className="h-12 w-full rounded-full"
      >
        <Plus aria-hidden className="size-5" />
        Track an urge
      </Button>
      <UrgeList />
    </main>
  );
}
