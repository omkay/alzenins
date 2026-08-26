import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), description: t("subtitle") };
}

const SECTIONS = ["journey", "philosophy", "path", "vision"] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -start-32 size-[30rem] rounded-full bg-secondary/20 blur-[130px]"
      />

      <div className="relative mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
          {t("subtitle")}
        </p>

        <div className="mt-14 flex flex-col gap-10">
          {SECTIONS.map((section) => (
            <section key={section}>
              <h2 className="flex items-center gap-3 text-2xl font-extrabold">
                <span aria-hidden className="h-6 w-1 rounded-full bg-accent" />
                {t(`${section}Title`)}
              </h2>
              <p className="mt-4 text-lg leading-loose text-pretty text-muted-foreground">
                {t(`${section}Body`)}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-14 rounded-xl border border-ring/30 bg-linear-140 from-accent/15 to-accent-light/5 px-7 py-6 text-xl font-bold text-pretty">
          {t("closing")}
        </p>
      </div>
    </div>
  );
}
