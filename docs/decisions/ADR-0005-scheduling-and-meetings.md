# ADR-0005 — Build the scheduling engine, integrate the meeting provider

| Field | Value |
| --- | --- |
| Status | Proposed |
| Date | 2026-08-26 |
| Deciders | Owner, engineering |

## Context

Two scheduling problems: recurring cohort classes with managed capacity, and 1:1 bookings
against native-speaker availability. Off-the-shelf tools (Calendly, Cal.com, Acuity) handle
the second reasonably and the first badly — they have no concept of a paid seat in a cohort,
a waitlist, an entitlement, or credits.

Video conferencing is a different question: building it is a company-sized project, and the
school already teaches on Zoom successfully.

## Decision

1. **Build the scheduling engine in our own database.** Cohorts, sessions, seats, waitlists,
   availability rules, materialised slots, and bookings are core domain — they are entangled
   with payments and entitlements, and cannot live in a third-party tool.
2. **Integrate the meeting provider behind a `MeetingProvider` port.** Zoom adapter first
   (Server-to-Server OAuth), because that is what instructors and students already use.
   A Google Meet adapter is a fallback if Zoom licensing becomes awkward.
3. **Store all times as UTC `timestamptz` plus an IANA timezone**, and render per user.
   Cohort schedules are anchored to the cohort's timezone so a Dubai 18:00 class stays at
   18:00 Dubai across DST changes elsewhere.
4. **Calendar interop is read-out, not read-in, for students** (ICS feed). For teachers,
   optional Google Calendar busy-sync, because a teacher's availability is the scarce
   resource and double-booking them is the expensive failure.

### Open sub-decision

Per-session Zoom meetings vs one recurring meeting per cohort. Recurring is fewer API calls
and a stable link students can memorise; per-session gives clean per-session recordings and
lets a substitute host one class. **Recommendation: recurring meeting per cohort, with
per-session override for substitutes.** Confirm during Phase 3.

## Consequences

- More code than adopting Calendly, and it is the right code — capacity, waitlist promotion,
  and credit spending are inseparable from booking.
- We own timezone and DST correctness. That needs property tests across DST boundaries,
  not manual spot-checks.
- Swapping Zoom for Meet later is an adapter, not a migration.
- Slot materialisation adds a background job and a regeneration edge case whenever a teacher
  changes availability — already-booked slots must survive regeneration.
