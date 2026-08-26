import { cn } from "@/lib/utils";

/**
 * The ز mark. It must always render in Cairo — Plus Jakarta Sans has no Arabic
 * coverage, so on the English side it would otherwise fall back to a system
 * font and render as a mangled glyph.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-140 from-primary to-secondary font-[family-name:var(--font-arabic)] text-lg font-extrabold text-accent-light",
        className,
      )}
    >
      ز
    </span>
  );
}
