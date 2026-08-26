import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { env, hasGoogleAuth } from "@/env";
import { getCurrentUser } from "@/server/auth/guards";
import { SignInForm } from "./sign-in-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("title") };
}

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (user) redirect({ href: "/dashboard", locale });

  const { callbackUrl } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-md px-5 py-16 sm:px-8 sm:py-24">
      <div className="rounded-xl border border-border bg-card p-7 shadow-warm sm:p-8">
        <SignInForm
          callbackUrl={callbackUrl ?? `/${locale}/dashboard`}
          googleEnabled={hasGoogleAuth}
          showDevHint={env.NODE_ENV !== "production"}
        />
      </div>
    </div>
  );
}
