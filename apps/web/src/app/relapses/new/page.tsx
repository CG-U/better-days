import { BackLink } from "@/components/back-link";
import { CrisisPanel } from "@/components/crisis-panel";
import { RelapseForm } from "@/features/relapses/components/relapse-form";

export const metadata = { title: "Log a Setback — Better Days" };

export default function NewRelapsePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-5 md:p-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center">
        <BackLink href="/relapses" label="Back to setbacks" />
        <h1 className="text-center font-heading text-2xl font-bold text-primary">
          Log a Setback
        </h1>
        <span aria-hidden className="size-12" />
      </header>
      <RelapseForm />
      <CrisisPanel />
    </main>
  );
}
