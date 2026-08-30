import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-muted-foreground",
        accent: "bg-accent-text/15 text-accent-text",
        primary: "bg-primary text-primary-foreground",
        success: "bg-success/12 text-success",
        warning: "bg-warning/15 text-warning",
        danger: "bg-danger/12 text-danger",
        /** "Class is live now" — pairs with the pulsing dot. */
        live: "bg-live text-live-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export { badgeVariants };
