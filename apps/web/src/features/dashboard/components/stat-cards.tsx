import type { DashboardStats } from "@better-days/shared";
import { CalendarDays, PiggyBank, Zap } from "lucide-react";

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function StatLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

export function StatCards({ stats }: { stats: DashboardStats }) {
  return (
    <section
      aria-label="Recovery progress"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-border bg-primary-container/25 p-6 sm:row-span-2">
        <Zap
          aria-hidden
          className="absolute -right-4 bottom-2 size-32 text-primary/10"
        />
        <StatLabel>Current momentum</StatLabel>
        <p className="font-heading">
          <span className="text-5xl font-extrabold text-primary">
            {stats.currentStreakDays}
          </span>{" "}
          <span className="text-2xl font-semibold text-foreground">
            {stats.currentStreakDays === 1 ? "Day" : "Days"} Strong
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          Longest streak: {stats.longestStreakDays}{" "}
          {stats.longestStreakDays === 1 ? "day" : "days"}
        </p>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-6">
        <div className="space-y-2">
          <StatLabel>Money saved</StatLabel>
          <p className="font-heading text-3xl font-bold text-secondary">
            {formatMoney(stats.moneySavedCents)}
          </p>
        </div>
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
          <PiggyBank aria-hidden className="size-6" />
        </span>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-6">
        <div className="space-y-2">
          <StatLabel>Total days</StatLabel>
          <p className="font-heading text-3xl font-bold text-foreground">
            {stats.recoveryDays}
          </p>
        </div>
        <span className="flex size-12 items-center justify-center rounded-full bg-primary-container/40 text-primary">
          <CalendarDays aria-hidden className="size-6" />
        </span>
      </div>
    </section>
  );
}
