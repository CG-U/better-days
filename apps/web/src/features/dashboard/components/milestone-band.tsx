"use client";

import type { Milestone, MilestonesSummary } from "@better-days/shared";
import { Award, Lock } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

/** Parsed as a plain calendar date — `achievedOn` carries no time or zone. */
function formatAchievedOn(achievedOn: string): string {
  const [year, month, day] = achievedOn.split("-").map(Number);
  return dateFormatter.format(new Date(year, month - 1, day));
}

function MilestoneChip({ milestone }: { milestone: Milestone }) {
  const Icon = milestone.achieved ? Award : Lock;

  return (
    <li
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-colors duration-200 ease-in-out",
        milestone.achieved
          ? "border-transparent bg-milestone-container text-on-milestone-container"
          : "border-border/60 bg-muted/40 text-muted-foreground",
      )}
    >
      <Icon
        aria-hidden
        className={cn("size-5", milestone.achieved && "text-milestone")}
      />
      <span className="text-sm font-semibold">{milestone.label}</span>
      <span className="text-xs">
        {milestone.achieved && milestone.achievedOn
          ? formatAchievedOn(milestone.achievedOn)
          : `${milestone.days} ${milestone.days === 1 ? "day" : "days"}`}
      </span>
    </li>
  );
}

/**
 * Earned milestones and the next one within reach.
 *
 * Locked rungs are shown, not hidden — the ladder should be visible from the
 * bottom of it. They are muted rather than crossed out, and nothing here ever
 * uses a failure tone: a milestone not yet reached is simply ahead of you.
 */
export function MilestoneBand({ summary }: { summary: MilestonesSummary }) {
  const { milestones, next } = summary;
  const earned = milestones.filter((milestone) => milestone.achieved);
  const latest = earned.at(-1);

  // After a setback the next rung is often one already earned — the ladder
  // remembers it, this run has not reached it yet. Say "again" rather than
  // let the band contradict the chip beside it.
  const nextAlreadyEarned = milestones.some(
    (milestone) => milestone.days === next?.days && milestone.achieved,
  );

  return (
    <SectionCard className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-xl font-semibold">Milestones</h2>
        <p className="text-sm text-muted-foreground">
          {earned.length} of {milestones.length} reached
        </p>
      </div>

      {next ? (
        <div className="flex items-center gap-4 rounded-2xl bg-milestone-container/50 p-5 text-on-milestone-container">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-milestone-container text-milestone">
            <Award aria-hidden className="size-6" />
          </span>
          <div>
            <p className="label-caps">Next milestone</p>
            <p className="font-medium text-foreground">
              {next.daysRemaining} more{" "}
              {next.daysRemaining === 1 ? "day" : "days"} to {next.label}
              {nextAlreadyEarned ? " again" : ""}.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 rounded-2xl bg-milestone-container/50 p-5 text-on-milestone-container">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-milestone-container text-milestone">
            <Award aria-hidden className="size-6" />
          </span>
          <div>
            <p className="label-caps">Every milestone</p>
            <p className="font-medium text-foreground">
              You have reached them all. Keep going — the days still count.
            </p>
          </div>
        </div>
      )}

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {milestones.map((milestone) => (
          <MilestoneChip key={milestone.days} milestone={milestone} />
        ))}
      </ul>

      {latest?.achievedOn ? (
        <p className="text-center text-sm text-muted-foreground">
          Your last milestone: {latest.label}, reached{" "}
          {formatAchievedOn(latest.achievedOn)}.
        </p>
      ) : null}
    </SectionCard>
  );
}
