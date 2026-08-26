# Phase 2 — Catalogue & Payments

**Goal:** money moves. A student in any target country sees a price in a sensible currency,
pays through MamoPay, and we record a paid order — reliably, idempotently, in both locales.

**Estimate:** 3–4 weeks · **Depends on:** Phase 1 · **Status:** `Unblocked, not started`

> Unblocked 2026-08-27: ADR-0003 accepted (Option A, MamoPay only), sandbox API key
> issued, VAT treatment set provisionally by ADR-0007, store scoped digital-only.

This is the highest-risk phase. Budget for it accordingly.

## In scope

### Catalogue
- `product` / `price` tables and admin CRUD for both
- Product kinds: `cohort_course`, `recorded_course`, `credit_pack`, `store_item`
- Bilingual content fields with a preview; draft → active → archived lifecycle
- Media upload to R2 with image optimisation
- Public course listing and course detail pages driven by the catalogue

### Multi-currency (see [ADR-0003](../decisions/ADR-0003-multi-currency-strategy.md))
- Price books: an authored `price` row per currency, never runtime FX conversion
- Country → display currency map for all 16 target countries
- Charge-currency resolution — **already built** in `code/src/lib/markets.ts`
  (`resolveCurrency()`), with the fallback map from ADR-0003 and a test asserting no market
  can resolve to a currency MamoPay cannot process
- `CurrencySwitcher` with country auto-detect and manual override, persisted per user
- Explicit UI when display currency ≠ charge currency ("You'll be charged 402 AED")
- Admin tooling to bulk-review price books and flag gaps

### Payments
- `PaymentProvider` port with the **MamoPay adapter** built first
- Hosted checkout: create order → create payment link → redirect → return → confirm
- Webhook endpoint: signature verification, `webhook_event` dedup table, async processing
- Order lifecycle: `draft` → `pending_payment` → `paid` / `failed`, with idempotency keys
- Fulfilment dispatch by line-item kind (stubs for kinds later phases implement)
- Refunds from the admin dashboard, with entitlement revocation hooks
- Payment receipts by email, bilingual, with the correct currency and VAT treatment
- Sandbox-driven integration tests for the full happy path and three failure paths

### Discounts (basic)
- `discount_code` with percent/fixed, validity window, redemption cap, per-currency fixed
  amounts. Advanced targeting lands in Phase 7.

## Out of scope

Subscriptions (Phase 4). Seat allocation (Phase 3). The digital store catalogue (Phase 7).

The **Stripe adapter** is out of scope entirely: ADR-0003 chose Option A, so v1 ships one
payment provider. Shipping and non-UAE tax are out of scope permanently — the store is
digital-only and UAE VAT is the only treatment applied (ADR-0007).

## Acceptance criteria

- [ ] An admin creates a product with prices in AED, SAR, QAR, EGP, USD, EUR, and it appears live
- [ ] A visitor from Saudi Arabia sees SAR and is charged SAR
- [ ] A visitor from Japan sees JPY and is told, before paying, that USD will be charged
- [ ] A visitor from Kuwait sees KWD and is charged AED
- [ ] A sandbox purchase completes and produces exactly one `paid` order
- [ ] Replaying the same webhook 10× still produces exactly one paid order and one receipt
- [ ] A webhook arriving *before* the browser returns from checkout is handled correctly
- [ ] An abandoned checkout leaves a `pending_payment` order that expires cleanly by job
- [ ] A failed card produces a `failed` order and a recoverable retry link
- [ ] A refund issued in admin flips the order to `refunded` and fires the revocation hook
- [ ] Prices cannot be manipulated: a tampered client payload is rejected server-side (tested)
- [ ] Receipts render correctly in Arabic RTL with the right currency symbol placement

## Risks

| Risk | Mitigation |
| --- | --- |
| MamoPay API surface differs from the docs | Spike against the sandbox in week 1, before building on assumptions. The key is already issued, so this can start immediately. |
| Currency coverage gap blocks target markets | Settled by ADR-0003 and already implemented and tested |
| Webhook ordering and duplicates | Event table + idempotency keys designed in, not bolted on |
| VAT treatment wrong | ADR-0007 applies UAE 5% inclusive **provisionally**. Rate and treatment are stored per order and configurable, so a correction is a settings change plus a backfill — not a migration. The accountant's written determination is a Phase 9 sign-off item. |

## Sign-off checklist

- [ ] All acceptance criteria demonstrated on staging against the MamoPay sandbox
- [ ] One real low-value transaction completed in production and refunded
- [ ] Price book reviewed and approved by the owner for all 16 countries
- [ ] Runbook written: what to do when a payment is stuck or a webhook is missed

## Sign-off

| Field | Value |
| --- | --- |
| Owner | |
| Date | |
| Carve-outs | |
