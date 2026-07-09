"use client";

import { LogOut, Moon, Sun, UserRound } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  Menu,
  MenuItem,
  MenuLinkItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { UserAvatar } from "@/components/user-avatar";
import { useLogout, useMe } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";

// Client-only value: the server cannot know the resolved theme, so it renders
// the neutral state and the client swaps in the real one. Same pattern as the
// dashboard greeting.
const emptySubscribe = () => () => {};

/**
 * Flips between light and dark. The theme is unknown until after hydration
 * (it may come from the OS), so the item stays disabled and label-less on the
 * first paint rather than guessing and flickering.
 */
function ThemeMenuItem() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <MenuItem
      // Keep the menu open so the user can see the theme change land.
      closeOnClick={false}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Icon aria-hidden className="size-4 text-muted-foreground" />
      {mounted ? (isDark ? "Light mode" : "Dark mode") : "Theme"}
    </MenuItem>
  );
}

/**
 * The avatar in the app nav. Opens an account menu (Profile, Sign out) rather
 * than navigating directly, so sign-out stays out of the primary nav surface.
 */
export function UserMenu({ className }: { className?: string }) {
  const me = useMe();
  const logout = useLogout();
  const user = me.data?.user;

  const displayName = user?.username ?? user?.email.split("@")[0];

  return (
    <Menu>
      <MenuTrigger
        aria-label="Account menu"
        className={cn(
          "transition-all duration-200 ease-in-out hover:ring-2 hover:ring-primary/40 data-[popup-open]:ring-2 data-[popup-open]:ring-primary",
          className,
        )}
      >
        <UserAvatar
          username={user?.username}
          email={user?.email}
          color={user?.avatarColor}
        />
      </MenuTrigger>

      <MenuPopup>
        {displayName ? (
          <div aria-hidden className="flex flex-col gap-0.5 px-3 py-2">
            <span className="truncate text-sm font-semibold text-foreground">
              {displayName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
        ) : null}

        <MenuLinkItem render={<Link href="/settings" />}>
          <UserRound aria-hidden className="size-4 text-muted-foreground" />
          Profile
        </MenuLinkItem>

        <ThemeMenuItem />

        <MenuSeparator />

        <MenuItem
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="text-warning data-[highlighted]:bg-warning-container data-[highlighted]:text-on-warning-container"
        >
          <LogOut aria-hidden className="size-4" />
          {logout.isPending ? "Signing out..." : "Sign out"}
        </MenuItem>
      </MenuPopup>
    </Menu>
  );
}
