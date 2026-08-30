"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export function Progress({
  className,
  value = 0,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full rounded-full bg-accent transition-[width]"
        style={{ width: `${value ?? 0}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

/**
 * Seats remaining in a cohort. Turns amber under three and red at the last one —
 * the urgency has to read without colour alone, so the label carries the count.
 */
export function SeatMeter({
  taken,
  capacity,
  label,
  className,
}: {
  taken: number;
  capacity: number;
  label: string;
  className?: string;
}) {
  const left = Math.max(0, capacity - taken);
  const pct = capacity === 0 ? 0 : Math.min(100, (taken / capacity) * 100);
  const tone = left === 0 ? "bg-danger" : left <= 2 ? "bg-warning" : "bg-accent";

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between text-sm font-bold">
        <span>{label}</span>
        <span className="tabular" dir="ltr">
          {taken}/{capacity}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={taken}
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div className={cn("h-full rounded-full", tone)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
