import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-border bg-input px-4 py-3 text-base leading-relaxed text-foreground placeholder:text-muted-foreground/70 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
