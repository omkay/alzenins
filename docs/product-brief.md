# Product Brief — Alzenins Platform

## 1. Where we are today

The live site (<https://alzenins.com>) is a Next.js App Router marketing site:

- Bilingual Arabic/English, RTL-first, Arabic as the primary voice.
- Routes: `/`, `/courses`, `/products`, `/about`, `/contact`.
- Tailwind with shadcn-style CSS custom properties (navy / cream / gold — see
  [`design-system.md`](design-system.md)).
- Fonts: Plus Jakarta Sans (Latin), Cairo (Arabic).
- Images on Cloudinary. Payment collection today is manual MamoPay payment links.
- Offer: Japanese diploma (year-long, to JLPT N3), JLPT N5–N3 prep, female-only cohorts,
  private tutoring. Classes on Zoom, Mon/Wed, 1 hour.
- Pricing today: 370–390 AED/month standard, 525 AED/month JLPT, 600 AED/month
  female-only annual, 2,000 AED for a 6-month commitment.
- Three instructors (Amjad, Rama, Anisa); 400+ students since 2020.

**The gap:** everything after "I want to join" is manual — payment links sent by hand,
seats tracked in spreadsheets, Zoom links pasted into WhatsApp, materials in Drive folders,
no student accounts, no self-serve rebooking, no store operations, single currency.

## 2. What we are building

A platform that owns the full student lifecycle: discover → buy → learn → renew.

### Personas

| Persona | Needs |
| --- | --- |
| **Student (new)** | Understand the offer in Arabic or English, see a price in their own currency, buy without talking to a human, get instant access |
| **Student (active)** | See their schedule, join today's class in one click, book a native-speaker session, watch recorded lessons, download materials, manage their subscription |
| **Teacher / native speaker** | Publish availability, see their roster, take attendance, upload materials, see who booked them |
| **Admin / owner** | Open and close class spots, move students between cohorts, manage the catalogue and prices, run the store, see revenue and churn |

### Non-goals (explicitly out of scope for v1)

- Building our own video-conferencing stack (we integrate Zoom/Meet, we don't rebuild it).
- A public teacher marketplace with third-party instructors and payouts.
- Native mobile apps (responsive web + PWA only).
- Automated placement testing with AI grading.
- Physical classroom / in-person location management.
- Multi-tenant white-label for other schools.

These may become v2. They are not v1.

## 3. Commercial model

Four revenue lines the platform must support cleanly:

1. **Cohort subscriptions** — recurring monthly seat in a live class group (the core today).
2. **Prepaid course terms** — one-off purchase of a 6/12-month programme at a discount.
3. **1:1 credits** — packs of native-speaker sessions, bookable against availability.
4. **Store** — curated physical/digital products (books, stationery, merch, material packs).

Plus **recorded courses**, sold either as a one-off unlock or bundled into a subscription tier.

## 4. Markets & currencies

| Region | Countries |
| --- | --- |
| GCC | UAE, Saudi Arabia, Qatar, Oman, Kuwait, Bahrain |
| Levant / Iraq | Jordan, Iraq, Palestine |
| North Africa | Egypt, Morocco, Algeria |
| International | Japan, Europe, USA |

Currency handling is a **hard architectural constraint**, not a formatting concern — see
[ADR-0003](decisions/ADR-0003-multi-currency-strategy.md). MamoPay does not support every
currency in that list, so display currency and charge currency are separate concepts.

## 5. Success criteria for v1

- A student in Riyadh can buy a monthly seat in SAR, see their class in their dashboard,
  and join the Zoom call — with zero manual admin involvement.
- An admin can open 12 seats in a new cohort, watch them fill, and close enrolment,
  without touching a spreadsheet.
- A subscription renews automatically, and a failed renewal triggers dunning rather than
  silent loss of access.
- Recorded course access is revoked correctly when a subscription lapses.
- The whole flow works in Arabic, RTL, on a phone.
