import type {
  RecentActivityItem,
  RecentActivityType,
} from "@better-days/shared";
import { BookOpen, HeartHandshake, NotebookPen, Sparkles, Zap } from "lucide-react";
import { SectionCard } from "@/components/section-card";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const ACTIVITY_STYLES: Record<
  RecentActivityType,
  { icon: typeof Zap; className: string }
> = {
  urge: {
    icon: Zap,
    className: "bg-primary-container/40 text-on-primary-container",
  },
  relapse: {
    icon: HeartHandshake,
    className: "bg-warning-container text-on-warning-container",
  },
  checkin: {
    icon: NotebookPen,
    className: "bg-secondary-container text-on-secondary-container",
  },
  journal: {
    icon: BookOpen,
    className: "bg-milestone-container/60 text-on-milestone-container",
  },
};

export function RecentActivity({ items }: { items: RecentActivityItem[] }) {
  return (
    <SectionCard className="space-y-4">
      <h2 className="font-heading text-xl font-semibold">Recent activity</h2>
      {items.length === 0 ? (
        <div className="flex items-center gap-4 rounded-xl bg-muted/60 p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-container/40 text-on-primary-container">
            <Sparkles aria-hidden className="size-5" />
          </span>
          <p className="text-sm text-muted-foreground">
            Nothing here yet — and that is okay. Your check-ins, managed urges,
            and milestones will show up here as you go.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const style = ACTIVITY_STYLES[item.type];
            return (
              <li key={item.id} className="flex items-center gap-4 py-2">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full ${style.className}`}
                >
                  <style.icon aria-hidden className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {dateFormatter.format(new Date(item.occurredAt))}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
