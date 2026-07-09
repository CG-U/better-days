import { Plus } from "lucide-react";
import Link from "next/link";
import { BackLink } from "@/components/back-link";
import { Button } from "@/components/ui/button";
import { UrgeList } from "@/features/urges/components/urge-list";

export const metadata = { title: "Your Urges — Better Days" };

export default function UrgesPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-5 md:p-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center">
        <BackLink href="/dashboard" label="Back to dashboard" />
        <h1 className="text-center font-heading text-2xl font-bold text-primary">
          Your Urges
        </h1>
        <span aria-hidden className="size-12" />
      </header>
      <p className="text-center text-muted-foreground">
        Every entry here is an urge you noticed and faced. That is progress.
      </p>
      <Button
        render={<Link href="/urges/new" />}
        nativeButton={false}
        size="lg"
        className="w-full rounded-full"
      >
        <Plus aria-hidden className="size-5" />
        Track an urge
      </Button>
      <UrgeList />
    </main>
  );
}
