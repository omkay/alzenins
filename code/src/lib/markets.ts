/**
 * The markets we sell into, with the currency each one is *displayed* in.
 *
 * Display currency and charge currency are separate concepts: MamoPay cannot
 * charge in eight of these sixteen currencies. ADR-0003 settled how that gap is
 * handled — Option A, MamoPay only, with a fallback charge currency.
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
export type CountryCode = Market["country"];

/**
 * Currencies MamoPay will actually accept.
 *
 * OBSERVED, not documented. Mamo's marketing pages claim 28 currencies; the
 * sandbox API rejects anything outside this list of twelve with
 * `VALIDATION_ERROR: Currency must be AED, EUR, GBP, RON, SAR, TRY, USD, AUD,
 * CAD, CHF, DZD, EGP`. An earlier version of this file trusted the published
 * figure and wrongly listed QAR — Qatar would have had a price that failed at
 * checkout. See docs/spikes/mamopay-sandbox.md.
 *
 * Whether production accepts more than the sandbox is an open question with
 * Mamo. Until that is answered in writing, this list is the safe one.
 */
export const MAMOPAY_CURRENCIES = new Set([
  "AED", "AUD", "CAD", "CHF", "DZD", "EGP", "EUR", "GBP", "RON", "SAR",
  "TRY", "USD",
]);

/** Everything settles to a UAE account in AED (ADR-0003). */
export const SETTLEMENT_CURRENCY = "AED";

/**
 * Where an unsupported market gets charged instead.
 *
 * GCC currencies are pegged to the dollar and locals are used to dollar
 * pricing, so AED keeps the number stable and the FX cost low. Everyone else
 * falls back to USD, which is universally understood.
 */
const FALLBACK_BY_COUNTRY: Partial<Record<CountryCode, string>> = {
  // Qatar moved here after the sandbox spike: QAR is not accepted, despite the
  // published currency list saying otherwise. QAR and AED are both dollar-pegged,
  // so the charged number stays stable.
  QA: "AED",
  OM: "AED",
  KW: "AED",
  BH: "AED",
  JO: "AED",
  IQ: "USD",
  PS: "USD",
  MA: "EUR",
  JP: "USD",
};

const DEFAULT_FALLBACK = "USD";

export function marketFor(country: string | null | undefined): Market | undefined {
  if (!country) return undefined;
  return MARKETS.find((m) => m.country === country);
}

export function isChargeable(currency: string) {
  return MAMOPAY_CURRENCIES.has(currency);
}

export type ResolvedCurrency = {
  /** What the price is shown in. */
  display: string;
  /** What the card is actually debited in. */
  charge: string;
  /** True when the two differ and the UI must say so before payment. */
  differs: boolean;
  country: CountryCode;
};

/**
 * Resolve both currencies for a viewer. Server-side only — the client never
 * chooses what it is charged in.
 */
export function resolveCurrency(
  country: string | null | undefined,
): ResolvedCurrency {
  const market = marketFor(country) ?? MARKETS[0]; // UAE is the home market.
  const display = market.currency;
  const charge = isChargeable(display)
    ? display
    : (FALLBACK_BY_COUNTRY[market.country] ?? DEFAULT_FALLBACK);

  return { display, charge, differs: display !== charge, country: market.country };
}

/** True when the viewer's display currency cannot be charged by MamoPay. */
export function needsFallbackCurrency(country: string | null | undefined) {
  const market = marketFor(country);
  return market ? !isChargeable(market.currency) : false;
}
