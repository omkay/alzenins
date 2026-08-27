# Phase 0 — Discovery & Sign-off

**Goal:** lock every decision that is expensive to reverse, and open every account that
has a lead time, so Phase 1 never blocks on an answer.

**Estimate:** 1 week · **Status:** `Partially answered`

> Four of the ten questions were answered on 2026-08-27 — enough to unblock Phase 2.
> The rest still gate Phases 3, 7 and 9. Phase 0 is **not** signed off.

| Answered | Outcome |
| --- | --- |
| Currency fallback | Option A — MamoPay only ([ADR-0003](../decisions/ADR-0003-multi-currency-strategy.md)) |
| MamoPay access | Sandbox key issued |
| VAT | UAE 5% inclusive, provisional ([ADR-0007](../decisions/ADR-0007-vat-treatment.md)) |
| Store scope | Digital only |
| Codebase | Fresh app (settled in Phase 1) |

| Still needed | Gates |
| --- | --- |
| Languages beyond Japanese | Data model |
| Zoom paid tier | Phase 3 |
| Student migration | Phase 9 |
| Teacher payouts | Confirm out of scope |
| Brand assets (vector logo) | Phase 1 polish |
| Price sheet per currency | Phase 2 |
| Legal pages | Phase 9 |

## In scope

- Answer all ten [open questions](../roadmap.md#open-questions-blocking-phase-1).
- Commercial model confirmed: exact products, tiers, prices per currency, discount ladder.
- Country → currency → provider matrix agreed and written down.
- Accounts opened and verified: MamoPay (live + sandbox), Zoom (paid tier), Stripe (if
  chosen), video host, Resend, WhatsApp BSP, Postgres host, Vercel, Sentry, PostHog.
- Legal pages drafted: Terms, Privacy, Refund & Cancellation policy, Class Attendance policy.
- Design direction reviewed and approved (canvas of key screens — see `docs/design/`).
- Content audit: what copy, imagery, and video from the current site carries over.

## Out of scope

Any application code. Resist it.

## Tasks

- [x] ~~Owner answers the ten open questions~~ — **four answered**, six outstanding
- [~] Write the product & price sheet: every SKU × every currency × every interval —
      **structure done**, exported to [`docs/price-book.json`](../price-book.json).
      Only UAE (390 AED) and Saudi (399 SAR) are the owner's own numbers; the other 14
      markets still carry engineering's suggestions and need the owner's review.
      Editable sheet: <https://claude.ai/code/artifact/93ab9dbe-e4e7-44a9-9c00-beb35c9ff80f>
- [x] Confirm MamoPay account verification and sandbox API key
- [x] Decide Stripe-fallback vs USD-fallback for uncovered currencies → ADR-0003 **Accepted**
- [ ] Confirm Zoom plan supports Server-to-Server OAuth
- [ ] Get a VAT determination in writing from the accountant — **provisional default applied, still required before launch**
- [ ] Inventory current students and where their records live
- [ ] Approve the design canvas for the 6 hero screens
- [ ] Collect brand assets: vector logo, photography, sakura motifs, instructor portraits
- [ ] Draft legal pages in `ar` and `en`

## Sign-off checklist

- [ ] Every open question in `roadmap.md` has a recorded answer
- [ ] ADR-0001 through ADR-0006 are all `Accepted`
- [ ] Price sheet exists and the owner has approved every number
- [ ] All third-party accounts are created and credentials are in the secret store
- [ ] Design direction approved
- [ ] Phase 1 scope re-confirmed against what we learned here

## Sign-off

| Field | Value |
| --- | --- |
| Owner | |
| Date | |
| Carve-outs | |
