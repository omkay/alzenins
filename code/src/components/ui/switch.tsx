"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent bg-muted transition-colors disabled:opacity-50 data-[state=checked]:bg-accent",
        className,
      )}
      {...props}
    >
      {/* Logical translate so the knob travels the correct way in RTL. */}
      <SwitchPrimitive.Thumb className="pointer-events-none block size-5 rounded-full bg-card shadow-sm transition-transform data-[state=checked]:ms-5 data-[state=unchecked]:ms-0.5" />
    </SwitchPrimitive.Root>
  );
}
