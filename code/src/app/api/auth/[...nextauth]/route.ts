import type { NextRequest } from "next/server";
import { handlers } from "@/server/auth";
import { clientIp, consume, tooManyRequests } from "@/server/rate-limit";

/**
 * Auth.js owns these routes, so the limits sit in front of its handlers rather
 * than inside a provider callback — that way both halves of the flow are
 * covered: requesting a code, and guessing at one.
 *
 * Every IP limit is paired with a limit on something the caller can't choose
 * freely (the email address), because `x-forwarded-for` is only trustworthy
 * behind a proxy we control.
 */
const LIMITS = {
  /** Requesting a sign-in code. */
  sendPerIp: { limit: 8, window: 15 * 60 },
  sendPerEmail: { limit: 5, window: 60 * 60 },
  /** Submitting a code. Six digits is a million combinations; this is the wall. */
  verifyPerIp: { limit: 12, window: 15 * 60 },
} as const;

async function limit(request: NextRequest): Promise<Response | null> {
  const { pathname } = request.nextUrl;
  const ip = clientIp(request);

  if (pathname.includes("/callback/email-otp")) {
    const result = await consume(
      `otp:verify:ip:${ip}`,
      LIMITS.verifyPerIp.limit,
      LIMITS.verifyPerIp.window,
    );
    if (!result.ok) return tooManyRequests(result.retryAfterSeconds);
    return null;
  }

  if (pathname.includes("/signin/email-otp") && request.method === "POST") {
    const byIp = await consume(
      `otp:send:ip:${ip}`,
      LIMITS.sendPerIp.limit,
      LIMITS.sendPerIp.window,
    );
    if (!byIp.ok) return tooManyRequests(byIp.retryAfterSeconds);

    // Read the address off a clone so Auth.js still gets an unconsumed body.
    let email: string | undefined;
    try {
      const form = await request.clone().formData();
      email = String(form.get("email") ?? "")
        .toLowerCase()
        .trim();
    } catch {
      // Not a form post — let Auth.js reject it; the IP limit above still applied.
    }

    if (email) {
      const byEmail = await consume(
        `otp:send:email:${email}`,
        LIMITS.sendPerEmail.limit,
        LIMITS.sendPerEmail.window,
      );
      if (!byEmail.ok) return tooManyRequests(byEmail.retryAfterSeconds);
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  return (await limit(request)) ?? handlers.GET(request);
}

export async function POST(request: NextRequest) {
  return (await limit(request)) ?? handlers.POST(request);
}
