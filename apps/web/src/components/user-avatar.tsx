import type { AvatarColor } from "@better-days/shared";
import { cn } from "@/lib/utils";

/**
 * Avatar colors map to Serene Recovery container tokens — never raw hex.
 * Keys come from AVATAR_COLORS in packages/shared.
 */
export const AVATAR_COLOR_CLASSES: Record<AvatarColor, string> = {
  sage: "bg-primary-container text-on-primary-container",
  sky: "bg-secondary-container text-on-secondary-container",
  sand: "bg-tertiary-container text-on-tertiary-container",
  plum: "bg-milestone-container text-on-milestone-container",
  clay: "bg-warning-container text-on-warning-container",
};

const DEFAULT_COLOR: AvatarColor = "sage";

/** The letter shown in the avatar: username first, else the email local-part. */
export function avatarInitial(
  username: string | null | undefined,
  email: string | null | undefined,
): string {
  const source = username?.trim() || email?.trim() || "";
  return source.charAt(0).toUpperCase() || "?";
}

export function UserAvatar({
  username,
  email,
  color,
  className,
}: {
  username: string | null | undefined;
  email: string | null | undefined;
  color: AvatarColor | null | undefined;
  className?: string;
}) {
  const displayName = username?.trim() || email?.split("@")[0] || "your";

  return (
    <span
      aria-label={`${displayName}'s avatar`}
      role="img"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full font-heading text-lg font-bold select-none",
        AVATAR_COLOR_CLASSES[color ?? DEFAULT_COLOR],
        className,
      )}
    >
      <span aria-hidden>{avatarInitial(username, email)}</span>
    </span>
  );
}
