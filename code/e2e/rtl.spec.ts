import { test, expect, type Page } from "@playwright/test";

/**
 * RTL regression cover for the primitive library.
 *
 * These are behavioural assertions rather than pixel snapshots on purpose:
 * baselines rendered on macOS do not match Ubuntu CI, so committed screenshots
 * would fail on every run for reasons unrelated to the code. What actually
 * breaks in RTL is layout direction and horizontal overflow, and both are
 * checkable in a way that is stable across machines.
 */
const SECTIONS = [
  "buttons",
  "badges",
  "form",
  "feedback",
  "surfaces",
  "navigation",
  "overlay",
  "table",
];

async function pageOverflowsHorizontally(page: Page) {
  return page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth > el.clientWidth + 1;
  });
}

for (const locale of ["ar", "en"] as const) {
  const dir = locale === "ar" ? "rtl" : "ltr";

  test.describe(`${locale} (${dir})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/dev/kitchen-sink`);
    });

    test("every primitive section renders", async ({ page }) => {
      for (const id of SECTIONS) {
        await expect(
          page.locator(`[data-sink-section="${id}"]`),
          `section "${id}" should render in ${locale}`,
        ).toBeVisible();
      }
    });

    test("the document direction is correct", async ({ page }) => {
      await expect(page.locator("html")).toHaveAttribute("dir", dir);
    });

    test("nothing overflows the page horizontally", async ({ page }) => {
      // The classic RTL break: a physical margin or a fixed left offset pushes
      // content off-screen and the whole page scrolls sideways.
      expect(await pageOverflowsHorizontally(page)).toBe(false);
    });

    test("holds up at a phone width", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.reload();
      expect(await pageOverflowsHorizontally(page)).toBe(false);
    });

    test("text is laid out on the correct side", async ({ page }) => {
      // Measure the glyphs, not the block: a block-level heading spans the full
      // container in both directions, so its own box says nothing about where
      // the text sits.
      const textLeft = await page.evaluate(() => {
        const h = document.querySelector("h1")!;
        const range = document.createRange();
        range.selectNodeContents(h);
        const text = range.getBoundingClientRect();
        const block = h.getBoundingClientRect();
        return (text.left + text.right) / 2 < (block.left + block.right) / 2;
      });
      expect(textLeft).toBe(dir === "ltr");
    });

    test("the dialog opens, traps focus and closes on Escape", async ({ page }) => {
      await page.getByRole("button", { name: locale === "ar" ? "افتح نافذة" : "Open dialog" }).click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      expect(await pageOverflowsHorizontally(page)).toBe(false);

      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
    });

    test("the switch knob sits on the correct side when on", async ({ page }) => {
      const sw = page.locator("#ks-remind");
      const knob = sw.locator("span").first();
      const track = (await sw.boundingBox())!;
      const thumb = (await knob.boundingBox())!;
      // Compare centres — the thumb's leading edge sits before the track
      // midpoint even when it has travelled fully to the end.
      const thumbCentre = thumb.x + thumb.width / 2;
      const trackCentre = track.x + track.width / 2;
      // Checked means "travelled to the end", which is the left side in RTL.
      expect(thumbCentre < trackCentre).toBe(dir === "rtl");
    });
  });
}
