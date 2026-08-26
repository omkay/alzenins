# Design Priorities — which screens get designed first

Full screen inventory lives in [`../design-system.md`](../design-system.md#7-screen-inventory-what-actually-gets-designed).
This file says what to design **first**, and why.

## The six hero screens

These carry the product. Everything else can be composed from the component library once
these are settled.

| # | Screen | Why it's first | The hard problem it must solve |
| --- | --- | --- | --- |
| 1 | **Course detail & enrolment** | Where money is decided | Price in the viewer's currency, seats-left urgency without sleaze, schedule legible across timezones, the charge-currency disclosure when it differs |
| 2 | **Student dashboard** | The screen students see most | "What is happening next, and how do I join it" answered in under two seconds — live class, progress, credits, actions |
| 3 | **Booking calendar** | The most novel interaction | Teacher availability in the student's timezone, credit cost visible, bookable on a phone, keyboard-operable, correct in RTL |
| 4 | **Checkout** | Highest-stakes conversion | Multi-currency clarity, guest vs account, mixed baskets (a seat plus a book), trust signals, three-field minimum |
| 5 | **Admin cohort & seats** | The operational core | Fill rate at a glance across many cohorts, seat adjustment in one action, waitlist visible, no spreadsheet nostalgia |
| 6 | **Lesson player** | Where the LMS lives or dies | Video + chapters + materials in one view, RTL layout with an LTR scrubber, resume state, works on a mid-range Android |

## Design constraints, carried from the existing brand

- Tokens are already decided and extracted from production — navy `#1b2a4a`, gold `#d8a25d`,
  cream `#faf7f1`, `1rem` radius. Do not invent a new palette.
- Plus Jakarta Sans (Latin) / Cairo (Arabic).
- Keep the blurred gradient blooms and warm shadows; they are the brand's signature.
- Sakura motifs as section decoration only, never behind text.
- **Design the Arabic version first**, then derive the English one. It is the primary
  market language and the harder layout — deriving LTR from RTL catches more than the reverse.
- Mobile first. The majority of this audience is on a phone.

## Store screens (added 2026-08-26)

Designed alongside the six, at the owner's request.

| # | Screen | The hard problem it must solve |
| --- | --- | --- |
| 7 | **Store listing** | Category filtering, stock states (low / sold out) legible at a glance, cart drawer with a shipping-threshold nudge, physical vs digital distinguishable in the grid |
| 8 | **Product detail** | Variant selection with an unavailable option shown rather than hidden, live stock, shipping quote for the viewer's country, cross-sell to the course bundle |

**The catalogue in these mockups is placeholder.** The live `/products` page is a "coming
soon" notice — there is no real catalogue to design from. Products, prices, and copy here
are plausible stock for a Japanese school and must be replaced.

Both screens deliberately show a **digital** product beside physical ones (`تحميل فوري`,
no shipping) because [open question 8](../roadmap.md#open-questions-blocking-phase-1) —
physical or digital — is still unanswered and roughly doubles the size of Phase 7.

## After the eight

Order the rest by: teacher "Today" view → course listing → subscription & billing →
admin catalogue → auth flows → transactional emails.

## Canvas

Design explorations for these screens are published as a canvas. Record the URL here once
it exists so future agents and the owner can find it:

| Canvas | URL | Last updated |
| --- | --- | --- |
| Alzenins Platform Screens | <https://claude.ai/code/artifact/a3d38d71-7095-4915-a595-1bfa0f8047fd> | 2026-08-26 |

Source artboards live in [`canvas/`](canvas/) as `.dc.html` files plus `canvas.json`.
To change the canvas, edit those files and re-seed — do not edit the published HTML.
