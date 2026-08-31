import type { ErrorEvent } from "@sentry/nextjs";

/**
 * Shared Sentry options. Everything here is inert without a DSN, so a local
 * checkout and CI need no configuration at all.
 */
export const sharedSentryOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT ?? "development",
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  // Sampled rather than exhaustive: performance data is useful in aggregate and
  // the volume is what makes it expensive.
  tracesSampleRate: process.env.SENTRY_ENVIRONMENT === "production" ? 0.1 : 1,
  // Students type email addresses and sign-in codes into this app.
  sendDefaultPii: false,
  beforeSend(event: ErrorEvent) {
    // A one-time code in a breadcrumb or URL would be a real leak.
    if (event.request?.url) {
      event.request.url = event.request.url.replace(
        /([?&])token=[^&]+/g,
        "$1token=[redacted]",
      );
    }
    return event;
  },
};
