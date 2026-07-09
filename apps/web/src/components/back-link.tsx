import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** 48px touch target (DESIGN.md § Components) with a visible focus ring. */
export function BackLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "focus-ring -ml-3 flex size-12 items-center justify-center rounded-full transition-colors hover:bg-muted",
        className,
      )}
    >
      <ArrowLeft aria-hidden className="size-6" />
    </Link>
  );
}
