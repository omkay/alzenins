import { setRequestLocale } from "next-intl/server";
import { requireRole } from "@/server/auth/guards";

/**
 * Placeholder. The real dashboard is Phase 8 — this exists now so the role
 * guard is exercised and tested from Phase 1 rather than bolted on later.
 */
export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const admin = await requireRole("admin", "owner");

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">
        {locale === "ar" ? "لوحة الإدارة" : "Admin"}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {admin.email} — {admin.role}
      </p>
    </div>
  );
}
