import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A styled native <select>. Deliberately not a Radix listbox: native selects
 * get the platform picker on mobile, which is faster to use one-handed and
 * handles RTL and long option lists without any work from us.
 */
export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-12 w-full rounded-lg border border-border bg-input px-4 text-base text-foreground disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
