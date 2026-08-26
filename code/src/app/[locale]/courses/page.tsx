import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarClock, Info } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { COURSES } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "courses" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "courses" });

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -end-32 size-[32rem] rounded-full bg-accent/25 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
          {t("subtitle")}
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {COURSES.map((course) => (
            <article
              key={course.key}
              className={`flex flex-col rounded-xl border bg-card p-7 shadow-warm ${
                course.featured ? "border-ring/40 shadow-warm-lg" : "border-border"
              }`}
            >
              <h2 className="text-xl font-extrabold">{t(`${course.key}Title`)}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {t(`${course.key}Desc`)}
              </p>

              <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <CalendarClock className="size-4 shrink-0 text-accent-text" aria-hidden />
                {t(`${course.key}Meta`)}
              </p>

              <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-6">
                <p className="flex items-baseline gap-2">
                  {course.priceAed ? (
                    <>
                      <span dir="ltr" className="tabular text-3xl font-bold tracking-tight">
                        {course.priceAed}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground">
                        {locale === "ar" ? "د.إ" : "AED"} · {t("perMonth")}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground">
                      {t("onRequest")}
                    </span>
                  )}
                </p>
                <Link href="/contact">
                  <Button variant={course.featured ? "accent" : "outline"}>
                    {t("askAbout")}
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Honest about what does not exist yet — enrolment lands in Phase 2. */}
        <p className="mt-8 flex items-start gap-3 rounded-lg bg-muted px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
          {t("note")}
        </p>
      </div>
    </div>
  );
}
