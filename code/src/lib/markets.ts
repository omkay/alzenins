/**
 * The markets we sell into, with the currency each one is *displayed* in.
 * Charge currency is resolved separately — MamoPay covers only some of these.
 * See docs/decisions/ADR-0003-multi-currency-strategy.md.
 */
export const MARKETS = [
  { country: "AE", nameAr: "الإمارات", nameEn: "United Arab Emirates", currency: "AED", timezone: "Asia/Dubai" },
  { country: "SA", nameAr: "السعودية", nameEn: "Saudi Arabia", currency: "SAR", timezone: "Asia/Riyadh" },
  { country: "QA", nameAr: "قطر", nameEn: "Qatar", currency: "QAR", timezone: "Asia/Qatar" },
  { country: "OM", nameAr: "عُمان", nameEn: "Oman", currency: "OMR", timezone: "Asia/Muscat" },
  { country: "KW", nameAr: "الكويت", nameEn: "Kuwait", currency: "KWD", timezone: "Asia/Kuwait" },
  { country: "BH", nameAr: "البحرين", nameEn: "Bahrain", currency: "BHD", timezone: "Asia/Bahrain" },
  { country: "JO", nameAr: "الأردن", nameEn: "Jordan", currency: "JOD", timezone: "Asia/Amman" },
  { country: "IQ", nameAr: "العراق", nameEn: "Iraq", currency: "IQD", timezone: "Asia/Baghdad" },
  { country: "EG", nameAr: "مصر", nameEn: "Egypt", currency: "EGP", timezone: "Africa/Cairo" },
  { country: "PS", nameAr: "فلسطين", nameEn: "Palestine", currency: "ILS", timezone: "Asia/Hebron" },
  { country: "MA", nameAr: "المغرب", nameEn: "Morocco", currency: "MAD", timezone: "Africa/Casablanca" },
  { country: "DZ", nameAr: "الجزائر", nameEn: "Algeria", currency: "DZD", timezone: "Africa/Algiers" },
  { country: "JP", nameAr: "اليابان", nameEn: "Japan", currency: "JPY", timezone: "Asia/Tokyo" },
  { country: "GB", nameAr: "المملكة المتحدة", nameEn: "United Kingdom", currency: "GBP", timezone: "Europe/London" },
  { country: "DE", nameAr: "ألمانيا", nameEn: "Germany", currency: "EUR", timezone: "Europe/Berlin" },
  { country: "US", nameAr: "الولايات المتحدة", nameEn: "United States", currency: "USD", timezone: "America/New_York" },
] as const;

export type Market = (typeof MARKETS)[number];

/** Currencies MamoPay can actually charge in — verified against Mamo's docs. */
export const MAMOPAY_CURRENCIES = new Set([
  "AED", "AUD", "CAD", "CHF", "CNY", "DKK", "DZD", "EGP", "EUR", "GBP",
  "HKD", "IDR", "INR", "NOK", "NZD", "PKR", "QAR", "RON", "SAR", "SEK",
  "SGD", "THB", "TRY", "USD",
]);

export function marketFor(country: string | null | undefined): Market | undefined {
  if (!country) return undefined;
  return MARKETS.find((m) => m.country === country);
}

/** True when the viewer's display currency cannot be charged by MamoPay. */
export function needsFallbackCurrency(country: string | null | undefined) {
  const market = marketFor(country);
  return market ? !MAMOPAY_CURRENCIES.has(market.currency) : false;
}
