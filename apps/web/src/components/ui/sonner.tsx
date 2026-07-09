"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      // Top-anchored: mutations usually navigate, and the new page starts at
      // the top, so the confirmation lands where the eye already is. The
      // desktop offset clears the sticky top nav (py-3 + min-h-11 ≈ 68px);
      // phones have no top nav, so the toast only clears the status bar.
      //
      // Below sonner's 600px breakpoint toasts go full-width, so the equal
      // left/right offsets centre them and they drop straight down. Above it
      // they sit in the right corner and slide in from off-screen right — see
      // the `[data-sonner-toast]` rules in globals.css.
      position="top-right"
      offset={{ top: "88px", right: "24px" }}
      mobileOffset={{
        top: "calc(env(safe-area-inset-top) + 16px)",
        left: "16px",
        right: "16px",
      }}
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-border bg-card text-card-foreground shadow-card",
          title: "font-semibold",
          description: "text-muted-foreground",
          icon: "text-primary",
        },
      }}
    />
  );
}
