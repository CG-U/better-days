import { cn } from "@/lib/utils";

/**
 * Level 1 surface (DESIGN.md § Elevation & Depth): a white card resting on the
 * background with a soft, diffused shadow rather than a hard border.
 * Every feature section should use this instead of hand-rolled border divs.
 */
export function SectionCard({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="section-card"
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-6 shadow-card",
        className,
      )}
      {...props}
    />
  );
}
