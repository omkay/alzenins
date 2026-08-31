import * as Sentry from "@sentry/nextjs";
import { sharedSentryOptions } from "./sentry.shared";

if (sharedSentryOptions.enabled) {
  Sentry.init({
    ...sharedSentryOptions,
    // Replays are off by default: they record what a student typed, and this
    // app handles sign-in codes and payment pages.
    replaysOnErrorSampleRate: 0,
    replaysSessionSampleRate: 0,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
