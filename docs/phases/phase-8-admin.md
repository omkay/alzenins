# Phase 8 — Admin & Operations

**Goal:** the owner and instructors run the whole business from the dashboard. No spreadsheets,
no WhatsApp coordination for things the system should know.

**Estimate:** 2–3 weeks · **Depends on:** Phase 3 (and benefits from 4–7) · **Status:** `Not started`

Admin CRUD is built incrementally in each prior phase. This phase makes it a coherent,
efficient operations tool rather than a pile of forms.

## In scope

### Overview
- KPI dashboard: MRR, active students, new vs churned this month, cohort fill rate,
  upcoming sessions, revenue by currency, credits outstanding, store orders pending
- Trend charts with period comparison; drill-through to the underlying list

### Class operations
- Cohort board: every cohort with seats taken / capacity, at-risk fill, teacher assignment
- Seat management: open more seats, close enrolment, move a student, comp a seat,
  bulk-message a cohort
- Session calendar across all cohorts with conflict detection on teachers
- Attendance reporting: per student, per cohort, per period; at-risk-student flagging

### People
- Student directory: search, filters (level, cohort, subscription status, country),
  profile view with full history — enrolments, payments, attendance, credits, orders
- Impersonation ("view as student") for support, fully audit-logged
- Teacher management: profiles, cohort load, availability overview, session counts

### Revenue
- Subscriptions: active, past due, cancelling, with the dunning queue front and centre
- Orders and refunds with search across every field
- Payout reconciliation view: what MamoPay settled vs what we recorded, with a drift report
- Currency exposure summary

### Content & catalogue
- Unified catalogue manager across all four product kinds
- Bulk price-book editing with a currency-gap warning
- Content publishing calendar

### Platform
- Audit log, searchable and filterable, covering every admin mutation
- Notification log with delivery status and resend
- Feature flags
- Settings: business details, tax config, policies, integration credentials status

### Teacher app
- "Today" view: next session, join button, roster, attendance in one screen
- My cohorts, my bookings, availability editor, materials upload, session notes

## Acceptance criteria

- [ ] The owner runs a full week of operations on staging without touching the database
- [ ] Every admin mutation appears in the audit log with before/after values
- [ ] Impersonation is possible, obvious on screen, time-limited, and logged
- [ ] A teacher completes a full session lifecycle from their phone: join, attendance, notes
- [ ] The reconciliation report correctly flags a deliberately introduced discrepancy
- [ ] KPI numbers match hand-calculated values on seeded data
- [ ] Admin lists stay responsive at 10,000 students and 50,000 orders (seeded load test)

## Sign-off checklist

- [ ] All acceptance criteria demonstrated on staging
- [ ] Owner and all three instructors trained and able to operate unaided
- [ ] Operations runbook complete and stored in `docs/`
- [ ] Role permissions reviewed — no instructor can see revenue data unless intended

## Sign-off

| Field | Value |
| --- | --- |
| Owner | |
| Date | |
| Carve-outs | |
