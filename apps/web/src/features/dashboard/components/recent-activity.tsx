import type { RecentActivityItem } from "@better-days/shared";
import { Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RecentActivity({ items }: { items: RecentActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex items-center gap-4 rounded-xl bg-muted/60 p-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-container/40 text-primary">
              <Sparkles aria-hidden className="size-5" />
            </span>
            <p className="text-sm text-muted-foreground">
              Nothing here yet — and that is okay. Your check-ins, managed
              urges, and milestones will show up here as you go.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-border p-4 text-sm"
              >
                <p className="font-medium">{item.label}</p>
                <p className="text-muted-foreground">
                  {new Date(item.occurredAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
