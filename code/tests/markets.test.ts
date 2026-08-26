import { describe, expect, it } from "vitest";
import {
  MARKETS,
  MAMOPAY_CURRENCIES,
  marketFor,
  needsFallbackCurrency,
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
});
