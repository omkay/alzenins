import { eq } from "drizzle-orm";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { auth } from "./index";

type Role = "student" | "teacher" | "admin" | "owner";

/**
 * The proxy redirect is a convenience for the browser. These are the actual
 * boundary — call one at the top of every protected page and server action.
 * See docs/architecture.md §6.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    const locale = await getLocale();
    redirect({ href: "/sign-in", locale });
  }
  return session!.user;
}

/**
 * Re-reads the role from the database rather than trusting the JWT, which can
 * be up to 30 days stale — long enough for a revoked admin to still hold a
 * token that says otherwise.
 */
export async function requireRole(...allowed: Role[]) {
  const sessionUser = await requireUser();

  const row = await db.query.users.findFirst({
    where: eq(users.id, sessionUser.id),
    columns: { id: true, email: true, name: true, role: true, status: true },
  });

  if (!row || row.status !== "active" || !allowed.includes(row.role)) {
    const locale = await getLocale();
    redirect({ href: "/", locale });
  }

  return row!;
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}
