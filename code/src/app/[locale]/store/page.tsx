import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "store" });
  return { title: t("title"), description: t("subtitle") };
}

/** The catalogue itself is Phase 7. This holds the route and the redirect target. */
export default async function StorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "store" });
  const tCourses = await getTranslations({ locale, namespace: "nav" });

  return (
    <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        {t("subtitle")}
      </p>

      <div className="mt-12 flex flex-col items-start gap-5 rounded-xl border border-border bg-card p-10 shadow-warm">
        <span className="flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <ShoppingBag aria-hidden />
        </span>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {t("comingSoon")}
        </p>
        <Link href="/courses">
          <Button variant="accent">{tCourses("courses")}</Button>
        </Link>
      </div>
    </div>
  );
}
