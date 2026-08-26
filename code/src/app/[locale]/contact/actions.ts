"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/server/db";
import { contactMessages } from "@/server/db/schema";
import { clientIp, consume } from "@/server/rate-limit";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  channel: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(4000),
  locale: z.enum(["ar", "en"]),
});

export type ContactState = { status: "idle" | "sent" | "error" | "limited" };

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // A public, unauthenticated write — so it is limited before anything else.
  const requestHeaders = await headers();
  const ip = clientIp(new Request("http://local", { headers: requestHeaders }));

  const limit = await consume(`contact:${ip}`, 5, 60 * 60);
  if (!limit.ok) return { status: "limited" };

  // Honeypot: a hidden field real people never fill in. Accept it silently so a
  // bot learns nothing from the response.
  if (String(formData.get("website") ?? "") !== "") return { status: "sent" };

  const parsed = schema.safeParse({
    name: formData.get("name"),
    channel: formData.get("channel"),
    message: formData.get("message"),
    locale: formData.get("locale"),
  });

  if (!parsed.success) return { status: "error" };

  await db.insert(contactMessages).values(parsed.data);
  return { status: "sent" };
}
