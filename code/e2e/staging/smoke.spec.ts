import { test, expect } from "@playwright/test";

/**
 * Runs against the deployed staging service. Everything here is either a read
 * or a write the environment is expected to receive (one contact message per
 * run, clearly labelled).
 */

test.describe("public pages", () => {
  for (const path of [
    "/ar",
    "/en",
    "/ar/courses",
    "/en/courses",
    "/ar/about",
    "/ar/store",
    "/ar/contact",
  ]) {
    test(`${path} responds`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status(), `${path} should be 200`).toBe(200);
    });
  }
});

test.describe("locale routing", () => {
  // The bare root negotiates from Accept-Language rather than always landing on
  // the default locale. Both directions are asserted so a change to that
  // behaviour is a deliberate one, not a surprise.
  test("the bare root follows an Arabic browser to /ar", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "ar-AE" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/ar$/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await ctx.close();
  });

  test("the bare root follows an English browser to /en", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });

  test("English renders LTR", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });

  test("the switcher keeps you on the same page", async ({ page }) => {
    await page.goto("/ar/courses");
    await page.getByRole("button", { name: "English" }).click();
    await page.waitForURL(/\/en\/courses/);
    await expect(page.getByRole("heading", { name: "Courses", level: 1 })).toBeVisible();
  });

  test("numbers do not reverse under RTL", async ({ page }) => {
    await page.goto("/ar");
    await expect(page.getByText("400+", { exact: true })).toBeVisible();
  });

  test("hreflang is absolute and points at this environment", async ({ page, baseURL }) => {
    await page.goto("/ar");
    const hrefs = await page.locator('link[rel="alternate"]').evaluateAll((els) =>
      els.map((e) => e.getAttribute("href")),
    );
    expect(hrefs.length).toBeGreaterThanOrEqual(3);
    for (const href of hrefs) expect(href).toContain(baseURL!);
  });
});

test.describe("legacy redirects from the brochure site", () => {
  for (const [from, to] of [
    ["/courses", "/ar/courses"],
    ["/about", "/ar/about"],
    ["/contact", "/ar/contact"],
    ["/products", "/ar/store"],
  ] as const) {
    test(`${from} redirects to ${to}`, async ({ page }) => {
      await page.goto(from);
      await expect(page).toHaveURL(new RegExp(`${to}$`));
    });
  }
});

test.describe("guards", () => {
  test("the dashboard refuses a signed-out visitor", async ({ page }) => {
    await page.goto("/ar/dashboard");
    await expect(page).toHaveURL(/\/ar\/sign-in\?callbackUrl=%2Far%2Fdashboard/);
  });

  test("the admin route refuses a signed-out visitor", async ({ page }) => {
    await page.goto("/ar/admin");
    await expect(page).toHaveURL(/\/ar\/sign-in/);
  });

  test("the component gallery is not served off localhost", async ({ page }) => {
    // The guard keys on APP_URL, so this is the check that it actually holds on
    // a real host rather than only in theory.
    const res = await page.goto("/ar/dev/kitchen-sink");
    expect(res?.status()).toBe(404);
  });
});

test.describe("sign-in", () => {
  test("the page renders and offers the email step", async ({ page }) => {
    await page.goto("/ar/sign-in");
    await expect(page.getByRole("heading", { name: "تسجيل الدخول" })).toBeVisible();
    await expect(page.getByLabel("البريد الإلكتروني")).toBeVisible();
  });

  test("requesting a code reaches the code step", async ({ page }) => {
    // Sends a real email, so this runs once and only to the address Resend's
    // shared sender will accept. Verifying the code itself cannot be automated
    // against a deployed environment — that step is manual, by design.
    await page.goto("/en/sign-in");
    await page.getByLabel("Email").fill("theczar333@gmail.com");
    await page.getByRole("button", { name: "Send code" }).click();
    await expect(page.getByRole("heading", { name: "Enter your code" })).toBeVisible();
  });
});

test("the contact form accepts a message", async ({ page }) => {
  await page.goto("/en/contact");
  await page.getByLabel("Name").fill("E2E smoke");
  await page.getByLabel("Email or WhatsApp").fill("e2e-smoke@alzenins.test");
  await page
    .getByLabel("Your message")
    .fill("Automated staging smoke test — safe to ignore or delete.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("we'll be in touch");
});
