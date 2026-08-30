import * as React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="Breadcrumb" className={cn("text-sm", className)} {...props} />;
}

export function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      className={cn("flex flex-wrap items-center gap-2 text-muted-foreground", className)}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("inline-flex items-center gap-2", className)} {...props} />;
}

/**
 * A chevron is directional, so it mirrors in LTR. Object icons never do —
 * see docs/design-system.md §3.
 */
export function BreadcrumbSeparator() {
  return (
    <ChevronLeft
      aria-hidden
      className="size-3.5 shrink-0 text-border ltr:rotate-180"
    />
  );
}

export function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span aria-current="page" className={cn("font-bold text-foreground", className)} {...props} />;
}
