import type { LucideIcon } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { cn } from "@/lib/utils";

const TONES = {
  primary: {
    card: "border-transparent bg-primary-container/25",
    accent: "text-primary",
  },
  secondary: {
    card: "border-transparent bg-secondary-container/30",
    accent: "text-secondary",
  },
  milestone: {
    card: "border-transparent bg-milestone-container/40",
    accent: "text-milestone",
  },
} as const;

export type StatTone = keyof typeof TONES;

/**
 * A summary tile for the analytics header strip. Tiles are rendered in a grid
 * whose cells stretch, so the number is pinned to the bottom (`mt-auto`) and
 * every tile's figure lines up regardless of title length.
 */
export function StatTile({
  eyebrow,
  title,
  value,
  unit,
  icon: Icon,
  tone,
}: {
  eyebrow: string;
  title: string;
  value: number;
  unit?: string;
  icon: LucideIcon;
  tone: StatTone;
}) {
  const { card, accent } = TONES[tone];

  return (
    <SectionCard className={cn("flex flex-col", card)}>
      <div className="flex items-center justify-between">
        <p className={cn("label-caps", accent)}>{eyebrow}</p>
        <Icon aria-hidden className={cn("size-5", accent)} />
      </div>
      <h2 className="mt-3 text-xl font-semibold">{title}</h2>
      <p className="mt-auto pt-4 font-heading">
        <span className={cn("text-stat-display", accent)}>{value}</span>
        {unit ? (
          <span className="ml-2 text-lg text-muted-foreground">{unit}</span>
        ) : null}
      </p>
    </SectionCard>
  );
}
