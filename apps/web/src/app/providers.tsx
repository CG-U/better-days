"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* `class` strategy: next-themes toggles `.dark` on <html>, which is what
          the `@custom-variant dark` in globals.css keys off.

          First visit is always light, regardless of the OS preference: DESIGN.md
          specifies the light palette, and it is the one that has been reviewed.
          `enableSystem` stays on so that "system" remains a valid stored value
          for anyone who already has it — only the unset case changed. The user's
          choice from the account menu is persisted in localStorage and wins. */}
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
