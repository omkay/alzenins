import { defineRouting } from "next-intl/routing";

/**
 * Arabic is the default, not a translation. See docs/design-system.md §3.
 * `always` keeps the locale in the URL for both languages so hreflang, analytics
 * and shared links are unambiguous.
 */
export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};

export const localeLabel: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
};
