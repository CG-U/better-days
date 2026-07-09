import { BackLink } from "@/components/back-link";
import { CopingAddForm } from "@/features/coping/components/coping-add-form";
import { CopingList } from "@/features/coping/components/coping-list";

export const metadata = { title: "Your Toolkit — Better Days" };

export default function ToolkitPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-5 md:p-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center">
        <BackLink href="/dashboard" label="Back to dashboard" />
        <h1 className="text-center font-heading text-2xl font-bold text-primary">
          Your Toolkit
        </h1>
        <span aria-hidden className="size-12" />
      </header>

      <p className="text-center text-muted-foreground">
        The things that help you through an urge. Written now, while things are
        calm — waiting for you when they are not.
      </p>

      <CopingAddForm />
      <CopingList />
    </main>
  );
}
