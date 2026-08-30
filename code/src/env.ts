import { z } from "zod";

/**
 * Fail at boot, not at the first request. Every environment variable the app
 * relies on is declared here; nothing reads `process.env` directly elsewhere.
 *
 * Each value is read by a literal `process.env.X` access on purpose — Next only
 * inlines those, so passing the whole `process.env` object would come back empty
 * in the edge runtime.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.url(),
  APP_URL: z.url().default("http://localhost:3000"),

  /** Signs session tokens. Generate with `openssl rand -base64 32`. */
  AUTH_SECRET: z.string().min(32),

  /** Google sign-in is optional locally; omit both and the button disappears. */
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),

  /** Without a key, sign-in codes are printed to the server console in dev. */
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("Alzenins <noreply@alzenins.com>"),

  /** Mamo Business API. Optional until Phase 2 wires up checkout. */
  MAMOPAY_API_KEY: z.string().optional(),
  MAMOPAY_ENV: z.enum(["sandbox", "production"]).default("sandbox"),

  /** Observability. All optional — absent keys disable the integration. */
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().default("development"),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.url().default("https://eu.i.posthog.com"),
});

function load() {
  const parsed = schema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    APP_URL: process.env.APP_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    MAMOPAY_API_KEY: process.env.MAMOPAY_API_KEY,
    MAMOPAY_ENV: process.env.MAMOPAY_ENV,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }

  return parsed.data;
}

export const env = load();

export const hasGoogleAuth = Boolean(
  env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET,
);

export const hasSentry = Boolean(env.NEXT_PUBLIC_SENTRY_DSN);
export const hasPostHog = Boolean(env.NEXT_PUBLIC_POSTHOG_KEY);

export const MAMOPAY_BASE_URL =
  env.MAMOPAY_ENV === "production"
    ? "https://business.mamopay.com/manage_api/v1"
    : "https://sandbox.dev.business.mamopay.com/manage_api/v1";
