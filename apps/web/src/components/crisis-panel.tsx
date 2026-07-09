import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The Philippine National Problem Gambling Helpline, run for PAGCOR by the
 * Seagulls Flock Organization. Free, confidential, 24/7, and open to family
 * members as well as gamblers.
 *
 * If this number ever changes, it changes here and nowhere else.
 *
 * NOT VERIFIED AT THE SOURCE. Taken from news coverage of the May 2026 launch
 * (iGB, Manila Bulletin, Inquirer all agree); pagcor.ph blocks automated
 * fetches, so nobody has confirmed it against the operator or dialled it.
 * Confirm before this reaches real users — a dead number on a crisis panel is
 * worse than no panel at all.
 */
export const HELPLINE = {
  name: "National Problem Gambling Helpline",
  display: "(02) 8248-9568",
  tel: "tel:+63282489568",
} as const;

/**
 * Reachable support, in the moments it matters — mid-craving and while logging a
 * setback. Deliberately toned with `secondary-container` (calm blue) rather than
 * a warning colour: this is an offer of help, not an alarm.
 */
export function CrisisPanel({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-4 rounded-2xl bg-secondary-container/40 p-5 sm:flex-row sm:items-center",
        className,
      )}
    >
      <span
        aria-hidden
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary-container/60 text-on-secondary-container"
      >
        <Phone className="size-6" />
      </span>

      <div className="flex-1">
        <p className="font-semibold text-foreground">
          You don&apos;t have to do this alone.
        </p>
        <p className="text-sm text-muted-foreground">
          The {HELPLINE.name} is free, confidential, and answers any hour of the
          day.
        </p>
      </div>

      <Button
        render={<a href={HELPLINE.tel} />}
        nativeButton={false}
        variant="secondary"
        size="lg"
        className="shrink-0 rounded-full"
      >
        <Phone aria-hidden className="size-5" />
        Call {HELPLINE.display}
      </Button>
    </aside>
  );
}
