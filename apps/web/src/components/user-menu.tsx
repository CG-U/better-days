"use client";

import {
  Bug,
  LogOut,
  MessageCircle,
  Moon,
  Phone,
  Sun,
  UserRound,
  Wrench,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { HELPLINE } from "@/components/crisis-panel";
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

        <MenuLinkItem render={<Link href="/toolkit" />}>
          <Wrench aria-hidden className="size-4 text-muted-foreground" />
          Coping toolkit
        </MenuLinkItem>

        <ThemeMenuItem />

        <MenuSeparator />

        {/* Both land on /support; the bug entry preselects its topic. Sitting
            above the helpline, not below it — reaching a person about the app
            and reaching a person about gambling are different needs, and the
            second one should never be the item you scroll past a bug report
            to find. */}
        <MenuLinkItem render={<Link href="/support?topic=bug" />}>
          <Bug aria-hidden className="size-4 text-muted-foreground" />
          Report a bug
        </MenuLinkItem>

        <MenuLinkItem render={<Link href="/support" />}>
          <MessageCircle aria-hidden className="size-4 text-muted-foreground" />
          Contact the developer
        </MenuLinkItem>

        <MenuSeparator />

        {/* Always reachable, never shouted about: a permanent "get help" tab
            would make the app feel like an emergency room on every visit. */}
        <MenuLinkItem href={HELPLINE.tel}>
          <Phone aria-hidden className="size-4 text-muted-foreground" />
          <span className="flex flex-col items-start">
            Get help now
            <span className="text-xs text-muted-foreground">
              {HELPLINE.display}
            </span>
          </span>
        </MenuLinkItem>

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
