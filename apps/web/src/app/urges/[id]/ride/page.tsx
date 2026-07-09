import { BackLink } from "@/components/back-link";
import { CopingToolkit } from "@/features/coping/components/coping-toolkit";
import { UrgeRide } from "@/features/urges/components/urge-ride";

export const metadata = { title: "Ride It Out — Better Days" };

export default async function RideUrgePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-5 md:p-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center">
        <BackLink href="/urges" label="Back to your urges" />
        <h1 className="text-center font-heading text-2xl font-bold text-primary">
          Ride It Out
        </h1>
        <span aria-hidden className="size-12" />
      </header>
      <UrgeRide id={id} toolkit={<CopingToolkit />} />
    </main>
  );
}
