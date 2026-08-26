# Phase 5 — 1:1 Booking with Native Speakers

**Goal:** a student buys a pack of credits, opens a calendar, sees real availability in their
own timezone, and books a native speaker in three taps.

**Estimate:** 2–3 weeks · **Depends on:** Phase 4 · **Status:** `Not started`

## In scope

### Teacher availability
- `availability_rule` (RRULE-based, open and blackout kinds) with a visual weekly editor
- Per-teacher settings: slot length, lead time, buffer between sessions, max per day
- Holiday and one-off blackout dates
- Optional Google Calendar read-sync so a teacher's personal busy blocks remove slots

### Slot materialisation
- Job maintains a rolling 60-day `slot` horizon per bookable teacher
- Regenerated on any availability change, preserving already-booked slots
- Unique constraint on `(teacher_id, starts_at)` as the anti-double-book backstop

### Credits
- `credit_pack` products (5 / 10 / 20 sessions) priced per currency
- Append-only `credit_ledger`; balance is a sum, never a mutable counter
- Expiry policy (recommend 6 months) with warning notifications at 30 and 7 days
- Subscription tiers may grant monthly credits that do not roll over

### Booking
- Student-facing booking calendar: teacher filter, timezone-correct, RTL-aware
- Book = transaction that atomically claims the slot, writes a `−1` ledger row, and creates
  the booking. Any failure rolls back all three
- Meeting auto-provisioned via the `MeetingProvider` port
- Cancellation policy: free cancel outside a window (recommend 24h) refunds the credit;
  inside the window forfeits it. Teacher cancellation always refunds and notifies
- Reschedule = cancel + rebook in one transaction
- No-show handling with a teacher-marked state and an admin override

### Notifications
Booking confirmed, T-24h, T-1h, cancelled, rescheduled, credits low, credits expiring.

## Out of scope

Teacher payouts. Public teacher ratings and reviews. Group bookings. All v2.

## Acceptance criteria

- [ ] A teacher paints Sun–Thu 16:00–20:00 availability and 40 slots/week appear
- [ ] A student in Morocco sees those slots in WET with the teacher's local time beneath
- [ ] Two students booking the same slot simultaneously: one succeeds, one gets a clear error
      and is not charged a credit
- [ ] Booking with a zero balance is blocked and routed to the credit-pack purchase
- [ ] Cancelling 25 hours ahead refunds the credit; 23 hours ahead does not
- [ ] A teacher cancelling always refunds the credit and notifies the student
- [ ] Deleting an availability rule does not delete already-booked slots
- [ ] Credit balance can never go negative — property-tested
- [ ] A DST shift in the student's zone does not move an existing booking's absolute time

## Sign-off checklist

- [ ] All acceptance criteria demonstrated on staging
- [ ] Instructors have used the availability editor themselves and can operate it unaided
- [ ] Cancellation policy published on the site and matches the code
- [ ] Runbook: force-cancel a booking, refund a credit, fix a double-book

## Sign-off

| Field | Value |
| --- | --- |
| Owner | |
| Date | |
| Carve-outs | |
