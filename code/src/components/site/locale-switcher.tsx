"use client";

import { useParams } from "next/navigation";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const current = params.locale as Locale;
  const next = routing.locales.find((l) => l !== current) ?? routing.defaultLocale;

  return (
    <button
      type="button"
      onClick={() =>
        // `pathname` is already locale-stripped by next-intl's navigation, so
        // this swaps the prefix and keeps the reader where they were.
        router.replace(pathname, { locale: next })
      }
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <Globe className="size-4 text-accent-text" aria-hidden />
      {t("switchLocale")}
    </button>
  );
}
