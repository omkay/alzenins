import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Home />;
}

function Home() {
  const t = useTranslations("home");

  return (
    <>
      <section className="relative overflow-hidden">
        {/* The brand's signature gradient blooms, carried over from the live site. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-48 -end-40 size-[38rem] rounded-full bg-accent/30 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-80 -start-32 size-[30rem] rounded-full bg-secondary/20 blur-[140px]"
        />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <span className="inline-flex rounded-full bg-accent-subtle px-3.5 py-1.5 text-xs font-extrabold text-accent-text">
            {t("eyebrow")}
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.25] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
            {t("subtitle")}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/courses">
              <Button variant="accent" size="lg">
                {t("ctaPrimary")}
                <ArrowLeft className="rtl:rotate-0 ltr:rotate-180" aria-hidden />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                <MessageCircle aria-hidden />
                {t("ctaSecondary")}
              </Button>
            </Link>
          </div>

          <dl className="mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat value="400+" label={t("stats.students")} />
            <Stat value="3" label={t("stats.instructors")} />
            <Stat value="N3" label={t("stats.level")} />
          </dl>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-warm">
      <dt className="sr-only">{label}</dt>
      <dd>
        {/*
         * dir=ltr keeps "400+" from reordering to "+400" inside an RTL page.
         * It has to sit on an inline element — on the block it would also drag
         * the text alignment to the left.
         */}
        <span className="block text-3xl font-bold tracking-tight">
          <span dir="ltr" className="tabular inline-block">
            {value}
          </span>
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">{label}</span>
      </dd>
    </div>
  );
}
