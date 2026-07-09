"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      // Bottom-anchored so it never covers the sticky desktop top nav; on
      // mobile it clears the fixed bottom bar (h-24 + breathing room).
      position="bottom-right"
      offset={{ bottom: "24px", right: "24px" }}
      mobileOffset={{ bottom: "104px", left: "16px", right: "16px" }}
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
