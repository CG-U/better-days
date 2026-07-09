/**
 * Circular streak visualizer (DESIGN.md § Data Visualization): the track uses
 * the Tertiary tone and the progress fill uses Primary Sage Green.
 *
 * The ring fills against the next milestone rather than the longest streak, so
 * a user just past a setback still sees meaningful forward motion.
 */
const MILESTONES = [7, 30, 60, 90, 180, 365];

function nextMilestone(days: number): number {
  return MILESTONES.find((m) => days < m) ?? MILESTONES[MILESTONES.length - 1];
}

const SIZE = 176;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function StreakRing({ days }: { days: number }) {
  const target = nextMilestone(days);
  const progress = Math.min(days / target, 1);
  const daysToGo = Math.max(target - days, 0);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
          role="img"
          aria-label={`${days} day streak. ${daysToGo} days until the ${target}-day milestone.`}
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-tertiary-container)"
            strokeWidth={STROKE}
            opacity={0.4}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-700 ease-in-out"
          />
        </svg>
        <div
          aria-hidden
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <span className="font-heading text-stat-display text-primary">
            {days}
          </span>
          <span className="text-sm font-semibold text-muted-foreground">
            {days === 1 ? "day" : "days"} strong
          </span>
        </div>
      </div>
      <p aria-hidden className="text-xs text-muted-foreground">
        {daysToGo === 0
          ? `${target}-day milestone reached`
          : `${daysToGo} ${daysToGo === 1 ? "day" : "days"} to your ${target}-day milestone`}
      </p>
    </div>
  );
}
