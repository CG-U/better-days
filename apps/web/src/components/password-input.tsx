"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * A password field that can be read back. Typing a password blind on a phone
 * keyboard is where most sign-in failures actually come from, and there is
 * nothing to protect here that the person holding the phone does not know.
 *
 * The toggle is a real button in the tab order: a keyboard user needs it for
 * the same reason a thumb-typing one does. `type` is owned by this component
 * and cannot be passed in — that is the whole point of it.
 */
export function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [revealed, setRevealed] = useState(false);
  const Icon = revealed ? EyeOff : Eye;

  return (
    <div className="relative">
      <Input
        {...props}
        type={revealed ? "text" : "password"}
        className={cn("pr-12", className)}
      />
      <button
        type="button"
        onClick={() => setRevealed((current) => !current)}
        aria-label={revealed ? "Hide password" : "Show password"}
        aria-pressed={revealed}
        className="focus-ring absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icon aria-hidden className="size-5" />
      </button>
    </div>
  );
}
