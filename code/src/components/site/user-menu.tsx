"use client";

import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

/**
 * Read client-side on purpose. Reading the session in the server layout would
 * opt the whole marketing site out of static rendering, and the home page is
 * the top SEO asset. The trade is a brief skeleton on first paint.
 */
export function UserMenu() {
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-10 w-28 animate-pulse rounded-lg bg-muted" />;
  }

  if (!session?.user) {
    return (
      <Link href="/sign-in">
        <Button size="sm">{t("signIn")}</Button>
      </Link>
    );
  }

  const label = session.user.name ?? session.user.email ?? "";

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard"
        className="flex items-center gap-2.5 rounded-full border border-border bg-card py-1.5 ps-3.5 pe-1.5 transition-colors hover:bg-muted"
      >
        <span className="max-w-28 truncate text-xs font-bold">{label}</span>
        <span className="flex size-7 items-center justify-center rounded-full bg-linear-140 from-accent-light to-accent text-xs font-extrabold text-accent-foreground">
          {label.slice(0, 1).toUpperCase()}
        </span>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        aria-label={tAuth("signOut")}
        title={tAuth("signOut")}
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut aria-hidden />
      </Button>
    </div>
  );
}
