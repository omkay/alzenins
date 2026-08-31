import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const OTP_SINK = ".e2e-otp.log";

/**
 * Runs against a production build rather than `next dev`: it is what CI and
 * staging actually serve, and Next 16 refuses to start a second dev server
 * when one is already running locally.
 */
export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    locale: "en-GB",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}/ar`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      E2E_OTP_SINK: OTP_SINK,
      APP_URL: `http://localhost:${PORT}`,
    },
  },
});

export { OTP_SINK, PORT };
