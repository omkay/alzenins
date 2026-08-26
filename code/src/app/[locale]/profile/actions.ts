"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { requireUser } from "@/server/auth/guards";
import { MARKETS } from "@/lib/markets";

const countries = MARKETS.map((m) => m.country) as [string, ...string[]];

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  locale: z.enum(["ar", "en"]),
  country: z.enum(countries),
  timezone: z.string().trim().min(1).max(64),
});

export type ProfileState = { ok: boolean; error?: string };

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  // The guard runs here too, not just on the page — a server action is its own
  // entry point and middleware never sees it. See docs/architecture.md §6.
  const user = await requireUser();

  const parsed = schema.safeParse({
    name: formData.get("name"),
    locale: formData.get("locale"),
    country: formData.get("country"),
    timezone: formData.get("timezone"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "invalid" };
  }

  // Timezone is validated against the runtime's own tz database rather than a
  // hand-kept list, so any IANA zone a student picks is accepted.
  if (!Intl.supportedValuesOf("timeZone").includes(parsed.data.timezone)) {
    return { ok: false, error: "unknown timezone" };
  }

  await db
    .update(users)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  revalidatePath("/[locale]/profile", "page");
  return { ok: true };
}
