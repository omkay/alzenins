import { appendFile } from "node:fs/promises";
import { env } from "@/env";

/**
 * Six-digit numeric codes rather than magic links. Links break when a student
 * opens them from an in-app browser or forwards them over WhatsApp — which is
 * how most of this audience receives email. A code they can retype always works.
 */
export function generateOtp(): string {
  const bytes = crypto.getRandomValues(new Uint32Array(1));
  return String(bytes[0] % 1_000_000).padStart(6, "0");
}

const templates = {
  ar: (code: string) => ({
    subject: `${code} — رمز الدخول إلى الزين`,
    text: `رمز الدخول الخاص بك هو ${code}\n\nصالح لمدة 10 دقائق. إذا لم تطلب هذا الرمز، تجاهل هذه الرسالة.`,
  }),
  en: (code: string) => ({
    subject: `${code} — your Alzenins sign-in code`,
    text: `Your sign-in code is ${code}\n\nIt expires in 10 minutes. If you didn't request it, ignore this email.`,
  }),
};

export async function sendOtpEmail(to: string, code: string, locale: "ar" | "en" = "ar") {
  const { subject, text } = templates[locale](code);

  // End-to-end tests need to read the code they were just sent, so this writes
  // it to a file the harness watches and sends nothing.
  //
  // Two gates, because the tests run a PRODUCTION build (`next start`), which
  // means NODE_ENV alone cannot distinguish a test run from a real deployment:
  // the variable is only ever set by playwright.config.ts, and the app URL must
  // be localhost. A real deployment satisfies neither.
  const sink = process.env.E2E_OTP_SINK;
  if (sink) {
    if (!env.APP_URL.startsWith("http://localhost")) {
      throw new Error(
        "E2E_OTP_SINK is only permitted when APP_URL is localhost",
      );
    }
    await appendFile(sink, JSON.stringify({ to, code }) + "\n", "utf8");
    return;
  }

  if (!env.RESEND_API_KEY) {
    // Dev fallback. Never reached in production — the env check below throws.
    if (env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is required in production");
    }
    console.info(
      `\n  ┌─ sign-in code ──────────────────────\n  │  ${to}\n  │  ${code}\n  └─────────────────────────────────────\n`,
    );
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: env.EMAIL_FROM, to, subject, text }),
  });

  if (!response.ok) {
    throw new Error(
      `Resend rejected the sign-in email: ${response.status} ${await response.text()}`,
    );
  }
}
