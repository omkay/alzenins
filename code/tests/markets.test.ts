import { describe, expect, it } from "vitest";
import {
  MARKETS,
  MAMOPAY_CURRENCIES,
  SETTLEMENT_CURRENCY,
  isChargeable,
  marketFor,
  needsFallbackCurrency,
  resolveCurrency,
} from "@/lib/markets";

describe("markets", () => {
  it("covers every country named in the product brief", () => {
    const expected = [
      "AE", "SA", "QA", "OM", "KW", "BH", "JO", "IQ",
      "EG", "PS", "MA", "DZ", "JP", "GB", "DE", "US",
    ];
    expect(MARKETS.map((m) => m.country).sort()).toEqual(expected.sort());
  });

  it("has a unique country and a valid IANA timezone per market", () => {
    const zones = Intl.supportedValuesOf("timeZone");
    const seen = new Set<string>();
    for (const market of MARKETS) {
      expect(seen.has(market.country), market.country).toBe(false);
      seen.add(market.country);
      expect(zones, market.country).toContain(market.timezone);
    }
  });

  /**
   * This is the ADR-0003 gap, pinned as a test. If MamoPay adds a currency, this
   * fails and forces a deliberate decision rather than a silent behaviour change.
   */
  it("flags exactly the eight markets MamoPay cannot charge", () => {
    const uncovered = MARKETS.filter(
      (m) => !MAMOPAY_CURRENCIES.has(m.currency),
    ).map((m) => m.country);

    expect(uncovered.sort()).toEqual(
      ["OM", "KW", "BH", "JO", "IQ", "PS", "MA", "JP"].sort(),
    );
  });

  it("resolves fallback status per country", () => {
    expect(needsFallbackCurrency("SA")).toBe(false);
    expect(needsFallbackCurrency("JP")).toBe(true);
    expect(needsFallbackCurrency(null)).toBe(false);
    expect(marketFor("AE")?.currency).toBe("AED");
    expect(marketFor("ZZ")).toBeUndefined();
  });

  /** ADR-0003 Option A: MamoPay only, with a fallback charge currency. */
  it("resolves a chargeable market to a single currency", () => {
    expect(resolveCurrency("SA")).toEqual({
      display: "SAR",
      charge: "SAR",
      differs: false,
      country: "SA",
    });
  });

  it("falls back to a chargeable currency where MamoPay cannot charge", () => {
    expect(resolveCurrency("JP")).toEqual({
      display: "JPY",
      charge: "USD",
      differs: true,
      country: "JP",
    });
    // Dollar-pegged GCC currencies fall back to AED, not USD.
    expect(resolveCurrency("KW").charge).toBe("AED");
    expect(resolveCurrency("MA").charge).toBe("EUR");
  });

  it("never resolves a charge currency MamoPay cannot process", () => {
    for (const market of MARKETS) {
      const resolved = resolveCurrency(market.country);
      expect(isChargeable(resolved.charge), market.country).toBe(true);
    }
  });

  it("defaults an unknown country to the home market", () => {
    expect(resolveCurrency(null).country).toBe("AE");
    expect(resolveCurrency("ZZ").charge).toBe("AED");
  });

  it("settles in AED", () => {
    expect(SETTLEMENT_CURRENCY).toBe("AED");
    expect(isChargeable(SETTLEMENT_CURRENCY)).toBe(true);
  });
});
