import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "flex gap-3 rounded-md border p-4 text-sm leading-relaxed [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        info: "border-info/30 bg-info/8 text-foreground [&>svg]:text-info",
        success: "border-success/30 bg-success/8 text-foreground [&>svg]:text-success",
        warning: "border-warning/40 bg-warning/10 text-foreground [&>svg]:text-warning",
        danger: "border-danger/30 bg-danger/8 text-foreground [&>svg]:text-danger",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

export function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

export function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("font-bold", className)} {...props} />;
}
