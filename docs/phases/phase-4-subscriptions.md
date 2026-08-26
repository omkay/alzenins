# Phase 4 — Subscriptions & Entitlements

**Goal:** the 390 AED/month seat renews itself. Access is granted and revoked by entitlements,
failed payments are chased rather than silently losing a student, and students manage their
own billing without messaging anyone.

**Estimate:** 2–3 weeks · **Depends on:** Phases 2 and 3 · **Status:** `Not started`

## In scope

### Entitlements engine
- `entitlement` table and a single `hasEntitlement(user, scope, resourceId)` read path
- Every access check in the codebase migrated to it — no feature reads `subscription` directly
- Sources: subscription, one-off order, manual admin grant (scholarships, comps, make-goods)
- Revocation on refund, cancellation, and expiry; grace periods as a first-class field

### Recurring billing
- MamoPay subscription creation via the `PaymentProvider` port
- `subscription` table mirroring provider state, reconciled by a nightly job
- Plan tiers per the Phase 0 price sheet, priced per currency
- Upgrade / downgrade with proration policy (decide and record in ADR — simplest defensible
  option: change at period end, no proration)
- Pause and resume (a real need for students travelling or during exams)
- Cancel at period end; access persists until `current_period_end`

### Dunning
- Failed-renewal job chain: retry at +1d, +3d, +7d; notify on each; grace until +10d;
  then expire the entitlement and free the cohort seat
- Card-update flow via a provider-hosted page
- Admin view of every past-due subscription with a manual-retry action

### Self-serve billing
- Billing page: current plan, next charge date and amount, payment method, invoice history
- Downloadable receipts, bilingual, VAT-correct
- Cancellation flow with a reason capture (churn data is worth having)

### Commitment terms
- The 6-month / annual prepaid options as one-off orders granting a long-dated entitlement,
  sitting alongside monthly subscriptions on the same access path

## Out of scope

Credits and 1:1 booking (Phase 5). Recorded-course content (Phase 6).
Entitlement *scopes* for those are defined here; the features that consume them are not.

## Acceptance criteria

- [ ] A monthly subscription created in sandbox renews automatically and extends the entitlement
- [ ] Cancelling on day 3 of a 30-day period leaves access working until day 30, then revokes
- [ ] A failed renewal runs the full dunning chain and the student receives all three notices
- [ ] After the grace period the cohort seat is freed and the waitlist promotes
- [ ] An admin grant gives a student access with no payment record, and is auditable
- [ ] A refund on a prepaid term revokes the entitlement immediately
- [ ] Pausing a subscription suspends billing and access, and resuming restores both
- [ ] The entitlement check is the only access gate — verified by grepping the codebase
- [ ] Provider state and our `subscription` rows agree after a deliberate desync test

## Risks

| Risk | Mitigation |
| --- | --- |
| Provider/local state drift | Nightly reconciliation job with alerting; provider is never the access authority |
| Renewal webhook missed entirely | Reconciliation catches it; grace period means a missed webhook never locks a paying student out |
| Proration complexity | Choose the simple policy (change at period end) and write it down |

## Sign-off checklist

- [ ] All acceptance criteria demonstrated on staging
- [ ] Dunning email and WhatsApp copy approved in both languages
- [ ] Refund and cancellation policy on the site matches what the code actually does
- [ ] Runbook: stuck subscription, disputed charge, manual entitlement grant

## Sign-off

| Field | Value |
| --- | --- |
| Owner | |
| Date | |
| Carve-outs | |
