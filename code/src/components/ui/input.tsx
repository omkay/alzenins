import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "h-12 w-full rounded-lg border border-border bg-input px-4 text-base text-foreground placeholder:text-muted-foreground/70 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-2 block text-sm font-bold text-foreground", className)}
      {...props}
    />
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-2 text-sm font-semibold text-danger">
      {children}
    </p>
  );
}
