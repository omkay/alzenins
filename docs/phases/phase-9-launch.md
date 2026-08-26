# Phase 9 — Hardening & Launch

**Goal:** go live without losing a student, a payment, or the search ranking.

**Estimate:** 2 weeks · **Depends on:** all prior phases · **Status:** `Not started`

## In scope

### Security
- Third-party or structured internal penetration test of auth, checkout, and access control
- Authorisation audit: every route and server action re-verified against its intended role
- Dependency audit and lockfile pinning; secret scanning in CI
- Rate limiting and bot protection on auth, checkout, booking, and search
- OWASP Top 10 pass; CSP, HSTS, and security headers configured and verified
- Confirm PCI SAQ-A posture: zero card data on our origin

### Performance
- Load test: 500 concurrent users, 100 simultaneous checkouts, 50 concurrent bookings
- Core Web Vitals green on the marketing pages and the student dashboard
- Database indexes reviewed against the real slow-query log; N+1 audit on list views
- Image and video delivery optimised; caching strategy documented
- Job queue behaviour under a backlog (simulate 1,000 queued renewals)

### Accessibility & localisation
- Full WCAG 2.1 AA audit with a screen reader, in both locales
- Every screen reviewed in RTL by an Arabic native speaker
- Translation completeness check and a copy review pass on all 40+ transactional messages

### Data migration
- Import existing students, their cohorts, and their payment history
- Reconcile imported subscriptions against MamoPay's live records
- Dry-run the migration on staging twice, with a verified rollback

### Cutover
- SEO: 301 map for every indexed URL, sitemap, hreflang for `ar`/`en`, structured data
- Analytics and conversion tracking verified end to end before, not after
- Monitoring: uptime, error budget, payment-failure alerting, webhook-lag alerting
- Backups verified by an actual restore, not a green checkmark
- Rollback plan with a decision owner and explicit trigger conditions
- Staged rollout: instructors → 20 pilot students → all existing students → public

### Documentation
- Operations runbook, incident playbook, on-call expectations, support macros in both languages

## Acceptance criteria

- [ ] Pen-test findings all resolved or explicitly accepted in writing
- [ ] Load test passes with no oversold seats, no double bookings, and no dropped payments
- [ ] A staging restore from backup succeeds and the data is verified correct
- [ ] Every legacy URL 301s to its new home; no ranking-relevant page 404s
- [ ] Migration dry-run reconciles to zero discrepancies
- [ ] Pilot cohort completes a full week live with no manual intervention
- [ ] Alerting fires correctly in a deliberately triggered failure drill

## Sign-off checklist

- [ ] All acceptance criteria met
- [ ] Owner signs the go-live decision
- [ ] Rollback plan rehearsed
- [ ] Support coverage arranged for the first 72 hours

## Sign-off

| Field | Value |
| --- | --- |
| Owner | |
| Date | |
| Carve-outs | |
