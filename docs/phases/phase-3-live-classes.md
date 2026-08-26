# Phase 3 — Live Classes & Calendar

**Goal:** the current business, automated. Cohorts with managed seats, generated sessions,
auto-provisioned Zoom links, a student calendar, and reminders that arrive on WhatsApp.

**Estimate:** 3–4 weeks · **Depends on:** Phase 2 · **Status:** `Not started`

## In scope

### Cohorts & seats
- `course` / `cohort` / `class_session` / `enrollment` / `waitlist_entry` tables
- Cohort creation in admin: teacher, capacity, start/end, schedule RRULE, timezone,
  gender policy (the female-only cohorts are a real product line, not a filter)
- Session generation from the RRULE, with per-session override, cancel, and reschedule
- **Concurrency-safe seat allocation** — transaction + `FOR UPDATE` on the cohort row
- Enrolment states: active / paused / cancelled / completed; admin move-between-cohorts
- Waitlist: FIFO queue, automatic promotion on a freed seat with a timed hold

### Checkout integration
- The `cohort_course` fulfilment handler from Phase 2 now actually allocates a seat
- Seat is **held** during checkout (short TTL) so two people can't buy the last one
- Sold-out cohorts show a waitlist CTA instead of a buy button

### Meetings
- `MeetingProvider` port; Zoom Server-to-Server OAuth adapter
- Meeting provisioned per session (or one recurring meeting per cohort — decide in ADR-0005)
- `/session/[id]/join` gate: enrolment check + time window, then redirect. Links never public
- Post-session recording fetch attached to the cohort's material library

### Calendar
- Student calendar: month / week / agenda, in the student's timezone, RTL-aware
- Teacher calendar: their sessions, roster preview, one-tap host link
- Per-user ICS feed with a rotating token
- "Live now" banner across the app when a session is within its join window

### Attendance & materials
- Teacher marks attendance from the session view (present / late / absent / excused)
- Per-session materials upload; students see materials for sessions they're enrolled in
- Attendance summary on the student profile and in admin

### Notifications
- Reminder jobs at T-24h and T-1h, email + WhatsApp, bilingual, timezone-correct
- Session cancelled / rescheduled / teacher-substituted notifications
- Enrolment confirmed, waitlist promoted

## Out of scope

Recurring billing for the seat (Phase 4 — here a seat comes from a one-off order).
1:1 booking (Phase 5). Teacher availability rules (Phase 5).

## Acceptance criteria

- [ ] Admin creates a 12-seat cohort meeting Mon/Wed 18:00 GST; 24 sessions generate correctly
- [ ] 50 simultaneous checkouts against 12 seats yield exactly 12 enrolments and 38 waitlisted
- [ ] Cancelling an enrolment frees the seat and promotes the head of the waitlist within a minute
- [ ] A student in Cairo sees the session at 17:00 EET; the same session shows 18:00 GST in Dubai
- [ ] The join link is dead 2 hours before class, live 10 minutes before, and dead after it ends
- [ ] A non-enrolled user hitting the join URL directly is refused server-side
- [ ] Rescheduling one session updates the Zoom meeting, the ICS feed, and notifies students
- [ ] The ICS feed subscribes cleanly in Apple Calendar and Google Calendar
- [ ] A T-1h WhatsApp reminder arrives in Arabic with the correct local time
- [ ] DST transition (Europe/US students) does not shift a GST-anchored class

## Risks

| Risk | Mitigation |
| --- | --- |
| Timezone and DST bugs | Store UTC + IANA zone; property-test the renderer across DST boundaries |
| Zoom API rate limits on bulk provisioning | Provision lazily per session via a queued job, not in a loop at cohort creation |
| Seat overselling | Explicit lock + a load test in the acceptance criteria, not a hope |
| WhatsApp template approval lead time | Submit templates for approval during Phase 2 |

## Sign-off checklist

- [ ] All acceptance criteria demonstrated on staging
- [ ] The concurrency load test is in CI and passing
- [ ] One real cohort dry-run with the instructors, end to end
- [ ] Runbook: how to cancel a class, substitute a teacher, and refund a session

## Sign-off

| Field | Value |
| --- | --- |
| Owner | |
| Date | |
| Carve-outs | |
