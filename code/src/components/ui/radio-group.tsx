"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

export function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2.5", className)} {...props} />;
}

export function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "size-5 shrink-0 rounded-full border border-border bg-input disabled:opacity-50 data-[state=checked]:border-accent-text",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex size-full items-center justify-center">
        <span className="size-2.5 rounded-full bg-accent-text" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
