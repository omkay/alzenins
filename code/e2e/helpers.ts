import { readFile, writeFile } from "node:fs/promises";
import { expect, type Page } from "@playwright/test";

export const OTP_SINK = ".e2e-otp.log";

/** Unique per run, so a rerun never collides with a previous account. */
export function uniqueEmail(prefix = "e2e") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@alzenins.test`;
}

export async function clearOtpSink() {
  await writeFile(OTP_SINK, "", "utf8").catch(() => {});
}

/**
 * The code arrives asynchronously — the server writes it while the browser is
 * still on the "enter your code" step — so poll rather than read once.
 */
export async function readOtp(email: string, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const raw = await readFile(OTP_SINK, "utf8").catch(() => "");
    const hit = raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as { to: string; code: string })
      .reverse()
      .find((entry) => entry.to === email);
    if (hit) return hit.code;
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`No sign-in code was issued for ${email} within ${timeoutMs}ms`);
}

/** Full sign-in: request a code, read it off the sink, submit it. */
export async function signIn(page: Page, email: string) {
  await page.goto("/en/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Send code" }).click();

  await expect(page.getByRole("heading", { name: "Enter your code" })).toBeVisible();

  const code = await readOtp(email);
  await page.getByLabel("Sign-in code").fill(code);
  await page.getByRole("button", { name: "Verify and sign in" }).click();

  await page.waitForURL(/\/(en|ar)\/dashboard/);
}
