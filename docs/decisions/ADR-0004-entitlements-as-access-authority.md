# ADR-0004 — Entitlements are the single access authority

| Field | Value |
| --- | --- |
| Status | Proposed |
| Date | 2026-08-26 |
| Deciders | Engineering |

## Context

Access can come from many places: a monthly subscription, a prepaid 6-month term, a one-off
recorded-course purchase, a bundle, a scholarship, a make-good after a cancelled class, or a
free trial. Each also needs to *stop*: on cancellation, refund, chargeback, or expiry.

The naive approach — each feature checking `subscription.status === 'active'` — breaks the
moment a second source of access exists, and it makes grace periods and admin grants
impossible without scattering special cases through the codebase.

## Options considered

### A — Feature-level checks against subscriptions and orders
Simple to start, and it fails in exactly the way described above.

### B — A single `entitlement` table that every access check reads
Payments and admin actions *produce* entitlements; features only *consume* them.

## Decision

**Option B.** One table: `(user, scope, resource_id, valid_from, valid_until, source, source_id,
revoked_at)`. One read path: `hasEntitlement(user, scope, resourceId)`.

Nothing in the application queries `subscription`, `payment`, or `order` to decide access.
An import-boundary lint rule enforces this.

## Consequences

- Refunds, cancellations, grace periods, scholarships, comps, and trials are all the same
  mechanism, differing only in `source` and dates.
- A missed renewal webhook cannot lock out a paying student — the entitlement's
  `valid_until` plus the grace period covers the gap while reconciliation catches up.
- Auditing "why does this person have access?" is one query.
- Cost: an extra write on every purchase, and a reconciliation job keeping entitlements in
  step with provider state.
- Requires discipline. The rule is worth nothing if one feature is allowed to bypass it.
