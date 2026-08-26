# ADR-0003 — Multi-currency strategy and the MamoPay coverage gap

| Field | Value |
| --- | --- |
| Status | **Proposed — blocks Phase 2. Needs an owner decision in Phase 0.** |
| Date | 2026-08-26 |
| Deciders | Owner, engineering |

## Context

We sell into 16 countries: UAE, Saudi Arabia, Qatar, Oman, Kuwait, Bahrain, Jordan, Iraq,
Egypt, Palestine, Morocco, Algeria, Japan, Europe, USA.

MamoPay is the chosen processor. Verified from Mamo's own documentation:

- Mamo supports **28 currencies** for payment links, invoices, and subscriptions:
  AED (default), AUD, CAD, CHF, CNY, DKK, DZD, EGP, EUR, GBP, HKD, IDR, INR, NOK, NZD, PKR,
  QAR, RON, SAR, SEK, SGD, THB, TRY, USD (and a few others).
- Settlement is **in AED to a UAE bank account**.
- When a customer pays in their local currency, they avoid their bank's FX fee — but
  **the business absorbs Mamo's FX cost** instead.

Mapping that against our markets:

| Market | Currency | Mamo support |
| --- | --- | --- |
| UAE | AED | ✅ |
| Saudi Arabia | SAR | ✅ |
| Qatar | QAR | ✅ |
| Egypt | EGP | ✅ |
| Algeria | DZD | ✅ |
| Europe / USA | EUR / USD / GBP | ✅ |
| **Japan** | **JPY** | ❌ |
| **Kuwait** | **KWD** | ❌ |
| **Bahrain** | **BHD** | ❌ |
| **Oman** | **OMR** | ❌ |
| **Jordan** | **JOD** | ❌ |
| **Iraq** | **IQD** | ❌ |
| **Morocco** | **MAD** | ❌ |
| **Palestine** | **ILS** | ❌ |

Eight of sixteen target markets have no native charge currency. Notably **Japan** — the
single most thematically important market for a Japanese-language school.

Separately: converting prices at runtime from a live FX rate produces ugly, unstable
prices (`107.43 SAR`), makes revenue forecasting harder, and hands pricing control to a
rate feed.

## Options considered

### A — Authored price books + MamoPay only, USD/AED fallback for uncovered markets
A student in Tokyo sees `¥6,200` as an *indicative* display price and is charged the
equivalent in USD. Simple, one processor, one reconciliation. Cost: friction and a small
FX fee for the customer in 8 markets, and a slightly dishonest-feeling checkout unless the
UI is very explicit about the charge currency.

### B — Authored price books + MamoPay primary + Stripe adapter for uncovered currencies
Native currency everywhere (Stripe covers JPY, KWD, BHD, OMR, JOD, MAD, ILS; IQD is
unsupported by both — Iraq falls back to USD regardless). Costs: a second processor to
reconcile, a second set of webhooks, a second subscription lifecycle, and Stripe onboarding
for a UAE entity.

### C — Runtime FX conversion from a rate feed
Rejected. Unstable prices, no pricing control, rounding complexity in 16 currencies,
and reconciliation pain when the charged amount differs from the displayed one.

## Decision

**Pending owner sign-off in Phase 0.** Engineering recommendation:

> **Start with Option A, build for Option B.** Ship Phase 2 with the MamoPay adapter only
> and explicit fallback-currency messaging. Because the `PaymentProvider` port exists from
> day one, adding Stripe later is an adapter plus a webhook route — not a refactor. Revisit
> once Japan and Kuwait revenue justifies the second processor's operational overhead.

Regardless of A or B, the following are **decided**:

1. **Authored price books.** A `price` row per `(product, currency, interval)`, set by hand
   with psychologically sensible rounding. No runtime FX conversion, ever.
2. **Display currency and charge currency are separate fields**, resolved server-side:
   `country → display currency → provider support check → charge currency`.
3. **When they differ, the UI says so before payment** — "Displayed in JPY · you'll be
   charged $42.00 USD" — on the product page and again on the checkout button.
4. **Settlement is AED.** All reporting has a settlement view alongside a charged view.
5. Admin sees a **currency-gap warning** for any active product missing a price in a
   target currency.

## Consequences

- Pricing becomes a commercial exercise per market, which is correct — 390 AED is not
  the right price in Cairo and Tokyo simultaneously.
- 16 currencies × N products is real catalogue work; the bulk price-book editor in Phase 8
  earns its place.
- Under Option A, 8 markets get a two-currency checkout. Clear copy is load-bearing, and
  the checkout conversion rate in those markets should be watched in PostHog.
- FX cost lands on the business. Model it into the price book, don't discover it in the
  settlement report.
