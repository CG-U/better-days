import type { DashboardStats } from "@better-days/shared";
import { CalendarDays, PiggyBank, Trophy } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { StreakRing } from "./streak-ring";

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function StatLabel({ children }: { children: React.ReactNode }) {
  return <p className="label-caps text-muted-foreground">{children}</p>;
}

function StatTile({
  label,
  value,
  icon,
  valueClassName,
  iconClassName,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  valueClassName: string;
  iconClassName: string;
}) {
  return (
    <SectionCard className="flex items-center justify-between">
      <div className="space-y-2">
        <StatLabel>{label}</StatLabel>
        <p className={`font-heading text-3xl font-bold ${valueClassName}`}>
          {value}
        </p>
      </div>
      <span
        className={`flex size-12 items-center justify-center rounded-full ${iconClassName}`}
      >
        {icon}
      </span>
    </SectionCard>
  );
}

export function StatCards({ stats }: { stats: DashboardStats }) {
  return (
    <section
      aria-label="Recovery progress"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <SectionCard className="flex flex-col items-center justify-center gap-4 border-transparent bg-primary-container/25 sm:row-span-3">
        <StatLabel>Current momentum</StatLabel>
        <StreakRing days={stats.currentStreakDays} />
      </SectionCard>

      <StatTile
        label="Money saved"
        value={formatMoney(stats.moneySavedCents)}
        valueClassName="text-secondary"
        icon={<PiggyBank aria-hidden className="size-6" />}
        iconClassName="bg-milestone-container text-on-milestone-container"
      />

      <StatTile
        label="Longest streak"
        value={`${stats.longestStreakDays} ${stats.longestStreakDays === 1 ? "day" : "days"}`}
        valueClassName="text-primary"
        icon={<Trophy aria-hidden className="size-6" />}
        iconClassName="bg-primary-container/40 text-on-primary-container"
      />

      <StatTile
        label="Total days"
        value={String(stats.recoveryDays)}
        valueClassName="text-foreground"
        icon={<CalendarDays aria-hidden className="size-6" />}
        iconClassName="bg-secondary-container text-on-secondary-container"
      />
    </section>
  );
}
