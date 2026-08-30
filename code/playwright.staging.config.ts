import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke suite for a deployed environment.
 *
 * Separate from the local config because a real environment cannot do two
 * things the local suite relies on: it will not hand out sign-in codes (the
 * file sink is gated to a localhost APP_URL), and it does not serve
 * /dev/kitchen-sink, so the RTL suite has nothing to point at. What is left is
 * still the majority of the value — routing, guards, redirects, locale
 * behaviour and the contact form, verified against the real deployment.
 */
const BASE_URL =
  process.env.STAGING_URL ??
  "https://alzenins-staging-467926779679.me-central1.run.app";

export default defineConfig({
  testDir: "./e2e/staging",
  fullyParallel: false,
  workers: 1,
  // A cold start on a scale-to-zero service can take several seconds.
  timeout: 60_000,
  expect: { timeout: 15_000 },
  retries: 1,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    locale: "en-GB",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
