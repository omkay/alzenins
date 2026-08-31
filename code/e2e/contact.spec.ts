import { test, expect } from "@playwright/test";

test("a visitor sends a contact message and sees confirmation", async ({ page }) => {
  await page.goto("/en/contact");

  await page.getByLabel("Name").fill("Mohammed Al Ali");
  await page.getByLabel("Email or WhatsApp").fill("mohammed@example.com");
  await page
    .getByLabel("Your message")
    .fill("Hello — could you tell me the schedule for the Japanese diploma?");

  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByRole("status")).toContainText("we'll be in touch");
});

test("the form refuses a message that is too short", async ({ page }) => {
  await page.goto("/en/contact");
  await page.getByLabel("Name").fill("Sara");
  await page.getByLabel("Email or WhatsApp").fill("sara@example.com");
  await page.getByLabel("Your message").fill("hi");
  await page.getByRole("button", { name: "Send message" }).click();

  // Native validation blocks submission; the success status never appears.
  await expect(page.getByRole("status")).toHaveCount(0);
});

test("the direct contact channels point at the real accounts", async ({ page }) => {
  await page.goto("/en/contact");
  await expect(page.getByRole("link", { name: /info@alzenins\.com/ })).toHaveAttribute(
    "href",
    "mailto:info@alzenins.com",
  );
  await expect(page.getByRole("link", { name: /alzen\.ins/ })).toHaveAttribute(
    "href",
    "https://www.instagram.com/alzen.ins/",
  );
});
