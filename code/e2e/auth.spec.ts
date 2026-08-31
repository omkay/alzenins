import { test, expect } from "@playwright/test";
import { clearOtpSink, readOtp, signIn, uniqueEmail } from "./helpers";

test.beforeEach(async () => {
  await clearOtpSink();
});

test("a new student signs in with an emailed code and reaches the dashboard", async ({ page }) => {
  const email = uniqueEmail();
  await signIn(page, email);
  await expect(page).toHaveURL(/\/en\/dashboard/);
  await expect(page.getByRole("heading", { name: /Hello/ })).toBeVisible();
});

test("a signed-out visitor is sent to sign-in with a callback URL", async ({ page }) => {
  await page.goto("/ar/dashboard");
  await expect(page).toHaveURL(/\/ar\/sign-in\?callbackUrl=%2Far%2Fdashboard/);
  await expect(page.getByRole("heading", { name: "تسجيل الدخول" })).toBeVisible();
});

test("a wrong code does not create a session", async ({ page }) => {
  const email = uniqueEmail();
  await page.goto("/en/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Send code" }).click();
  await expect(page.getByRole("heading", { name: "Enter your code" })).toBeVisible();

  await readOtp(email); // the real code exists; we deliberately submit another
  await page.getByLabel("Sign-in code").fill("000000");
  await page.getByRole("button", { name: "Verify and sign in" }).click();

  await expect(page).not.toHaveURL(/dashboard/);
  await page.goto("/en/dashboard");
  await expect(page).toHaveURL(/\/en\/sign-in/);
});

test("a student is refused the admin route server-side", async ({ page }) => {
  // Seeded users are students; a fresh sign-up is one too.
  await signIn(page, uniqueEmail());

  await page.goto("/en/admin");
  // requireRole() redirects home rather than rendering the page.
  await expect(page).toHaveURL(/\/en$|\/en\/$/);
  await expect(page.getByRole("heading", { name: /Admin/ })).toHaveCount(0);
});

test("signing out clears the session", async ({ page }) => {
  await signIn(page, uniqueEmail());
  await page.getByRole("button", { name: "Sign out" }).click();
  // Don't pin the landing URL — signOut redirects to "/", which the locale
  // proxy then rewrites. What matters is that the session is gone.
  await page.waitForURL((url) => !url.pathname.includes("/dashboard"));

  await page.goto("/en/dashboard");
  await expect(page).toHaveURL(/\/en\/sign-in/);
});
