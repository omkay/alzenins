import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarDays, UserRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/server/auth/guards";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("dashboard") };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await requireUser();
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {t("greeting", { name: user.name ?? user.email ?? "" })}
        </h1>
        <Link href="/profile">
          <Button variant="outline" size="sm">
            <UserRound aria-hidden />
            {t("profile")}
          </Button>
        </Link>
      </div>

      {/* Real schedule, progress and credits arrive in Phases 3–6. */}
      <div className="mt-10 flex flex-col items-start gap-5 rounded-xl border border-border bg-card p-10 shadow-warm">
        <span className="flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <CalendarDays aria-hidden />
        </span>
        <p className="max-w-md leading-relaxed text-muted-foreground">
          {t("empty")}
        </p>
        <Link href="/courses">
          <Button variant="accent">{t("browseCourses")}</Button>
        </Link>
      </div>
    </div>
  );
}
