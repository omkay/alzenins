# Phase 6 — Recorded Courses (LMS)

**Goal:** self-paced courses with real video, downloadable materials, tracked progress, and
access that is genuinely revocable — sold as a one-off unlock or bundled into a subscription.

**Estimate:** 3 weeks · **Depends on:** Phase 4 · **Status:** `Not started`

## In scope

### Content model & authoring
- `recorded_course` → `module` → `lesson` → `asset`, bilingual titles and descriptions
- Admin content manager: drag-to-reorder modules and lessons, bulk upload, publish/draft
- Video upload to Mux (or Cloudflare Stream) with automatic transcoding and thumbnails
- Subtitle/caption tracks — Arabic and English. Non-optional for a language school
- Materials: PDFs, audio, worksheets in R2, per-locale variants
- Free preview lessons for the course sales page

### Access control
- **Signed, short-lived playback tokens** issued per request after an entitlement check.
  A revoked entitlement kills playback within the token TTL, not "when the page reloads"
- Signed, expiring download URLs for materials — never a public bucket path
- Drip strategies: all-at-once, weekly, or anchored to a cohort's schedule
- Download-prevention is best-effort by design; watermark the player with the student's
  email rather than pretending DRM is achievable at this budget

### Learning experience
- Lesson player: resume position, playback speed, chapter list, next/previous, notes
- Progress tracking per lesson and per course; `ProgressRing` on the dashboard
- Course completion certificate (PDF, bilingual) — a real motivator for JLPT students
- Materials library aggregating everything the student has access to, live and recorded

### Commerce integration
- `recorded_course` fulfilment handler grants a perpetual entitlement on one-off purchase
- Subscription tiers grant a time-bounded entitlement to a bundle of courses
- Bundle pricing: recorded course + cohort seat at a combined price

## Out of scope

Quizzes and auto-graded assessment. Discussion forums. AI tutoring. Live-stream recording
editing. Certificates with external verification. All v2 candidates.

## Acceptance criteria

- [ ] An admin uploads a 40-minute video and it is playable in both locales within minutes
- [ ] A student with an active subscription plays a lesson; playback resumes where they left off
- [ ] Revoking the entitlement stops new playback tokens being issued, verified by direct
      API call — not just a hidden button
- [ ] A material download URL copied and used an hour later is rejected
- [ ] A weekly-drip course unlocks module 2 exactly 7 days after enrolment
- [ ] Preview lessons play for a signed-out visitor; non-preview lessons do not
- [ ] Arabic captions display correctly and the player layout is correct in RTL
- [ ] Progress and completion survive switching devices
- [ ] The player is fully keyboard-operable and screen-reader labelled

## Risks

| Risk | Mitigation |
| --- | --- |
| Video hosting cost surprise | Model cost per student-hour in Phase 0; Cloudflare Stream if Mux is too rich |
| Content production is the real bottleneck | Ship the platform with 1 pilot course; content is a parallel workstream, flag it early |
| Piracy | Accept it. Watermark, don't over-engineer |

## Sign-off checklist

- [ ] All acceptance criteria demonstrated on staging
- [ ] One complete pilot course published and reviewed by an instructor
- [ ] Video cost per active student modelled against real usage
- [ ] Runbook: replace a video, fix a broken asset, grant emergency access

## Sign-off

| Field | Value |
| --- | --- |
| Owner | |
| Date | |
| Carve-outs | |
