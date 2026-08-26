# Phase 0 — Discovery & Sign-off

**Goal:** lock every decision that is expensive to reverse, and open every account that
has a lead time, so Phase 1 never blocks on an answer.

**Estimate:** 1 week · **Status:** `Not started`

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

- [ ] Owner answers the ten open questions; each answer captured in an ADR or the journal
- [ ] Write the product & price sheet: every SKU × every currency × every interval
- [ ] Confirm MamoPay account verification and sandbox API key
- [ ] Decide Stripe-fallback vs USD-fallback for uncovered currencies → close ADR-0003
- [ ] Confirm Zoom plan supports Server-to-Server OAuth
- [ ] Get a VAT determination in writing from the accountant
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
