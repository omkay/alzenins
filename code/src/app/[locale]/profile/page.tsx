import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { requireUser } from "@/server/auth/guards";
import { marketFor, needsFallbackCurrency } from "@/lib/markets";
import { ProfileForm } from "./profile-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile" });
  return { title: t("title") };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sessionUser = await requireUser();
  const t = await getTranslations({ locale, namespace: "profile" });

  const row = await db.query.users.findFirst({
    where: eq(users.id, sessionUser.id),
    columns: {
      name: true,
      email: true,
      locale: true,
      country: true,
      timezone: true,
      role: true,
    },
  });

  if (!row) throw new Error("Signed-in user has no database row");

  const market = marketFor(row.country);

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">{t("title")}</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        {t("subtitle")}
      </p>

      <div className="mt-9 rounded-xl border border-border bg-card p-7 shadow-warm">
        <ProfileForm
          timezones={Intl.supportedValuesOf("timeZone")}
          defaults={{
            name: row.name ?? "",
            email: row.email,
            locale: row.locale,
            country: row.country ?? "AE",
            timezone: row.timezone,
            role: row.role,
          }}
        />
      </div>

      {/* Makes the ADR-0003 gap visible while the price books are still being built. */}
      {market && (
        <p className="mt-5 rounded-lg bg-muted px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          {locale === "ar"
            ? `الأسعار ستُعرض بـ ${market.currency}.`
            : `Prices will be shown in ${market.currency}.`}
          {needsFallbackCurrency(row.country) &&
            (locale === "ar"
              ? " التحصيل سيتم بعملة أخرى — سيظهر ذلك بوضوح قبل الدفع."
              : " Charging happens in a different currency — that will be stated before payment.")}
        </p>
      )}
    </div>
  );
}
