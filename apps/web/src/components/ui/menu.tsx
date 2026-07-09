"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import type * as React from "react";
import { cn } from "@/lib/utils";

function Menu(props: React.ComponentProps<typeof BaseMenu.Root>) {
  return <BaseMenu.Root data-slot="menu" {...props} />;
}

function MenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Trigger>) {
  return (
    <BaseMenu.Trigger
      data-slot="menu-trigger"
      className={cn("focus-ring rounded-full", className)}
      {...props}
    />
  );
}

/**
 * The popup, portalled and positioned against the trigger. `align`/`sideOffset`
 * are forwarded to the positioner; everything else styles the popup itself.
 */
function MenuPopup({
  className,
  align = "end",
  side = "bottom",
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup> &
  Pick<
    React.ComponentProps<typeof BaseMenu.Positioner>,
    "align" | "side" | "sideOffset"
  >) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        className="z-50"
      >
        <BaseMenu.Popup
          data-slot="menu-popup"
          className={cn(
            "min-w-48 origin-[var(--transform-origin)] rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-card",
            "transition-[transform,opacity] duration-150 ease-out",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            className,
          )}
          {...props}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

const itemClasses =
  "flex min-h-11 w-full cursor-default items-center gap-3 rounded-xl px-3 text-sm font-semibold outline-none select-none transition-colors duration-150 data-[highlighted]:bg-muted data-[highlighted]:text-foreground";

function MenuItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Item>) {
  return (
    <BaseMenu.Item
      data-slot="menu-item"
      className={cn(itemClasses, className)}
      {...props}
    />
  );
}

/** Use for navigation entries — renders an `<a>` (pass `render={<Link .. />}`). */
function MenuLinkItem({
  className,
  closeOnClick = true,
  ...props
}: React.ComponentProps<typeof BaseMenu.LinkItem>) {
  return (
    <BaseMenu.LinkItem
      data-slot="menu-link-item"
      closeOnClick={closeOnClick}
      className={cn(itemClasses, "no-underline", className)}
      {...props}
    />
  );
}

function MenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Separator>) {
  return (
    <BaseMenu.Separator
      data-slot="menu-separator"
      className={cn("mx-1 my-1.5 h-px bg-border", className)}
      {...props}
    />
  );
}

export {
  Menu,
  MenuItem,
  MenuLinkItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
};
