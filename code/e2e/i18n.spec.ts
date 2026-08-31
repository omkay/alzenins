import { test, expect } from "@playwright/test";

test("Arabic is the default locale and renders RTL", async ({ page }) => {
  await page.goto("/ar");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("dir", "rtl");
  await expect(html).toHaveAttribute("lang", "ar");
});

test("English renders LTR", async ({ page }) => {
  await page.goto("/en");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("dir", "ltr");
  await expect(html).toHaveAttribute("lang", "en");
});

test("the locale switcher keeps you on the same page", async ({ page }) => {
  await page.goto("/ar/courses");
  await page.getByRole("button", { name: "English" }).click();
  await page.waitForURL(/\/en\/courses/);
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { name: "Courses", level: 1 })).toBeVisible();
});

test("numbers stay Western and do not reverse under RTL", async ({ page }) => {
  await page.goto("/ar");
  // "400+" must not render as "+400" — see docs/journal/2026-08-26.md.
  await expect(page.getByText("400+", { exact: true })).toBeVisible();
});

test("legacy brochure URLs redirect to the Arabic site", async ({ page }) => {
  for (const [from, to] of [
    ["/courses", "/ar/courses"],
    ["/about", "/ar/about"],
    ["/contact", "/ar/contact"],
    ["/products", "/ar/store"],
  ]) {
    await page.goto(from);
    await expect(page, `${from} should redirect to ${to}`).toHaveURL(
      new RegExp(`${to}$`),
    );
  }
});
