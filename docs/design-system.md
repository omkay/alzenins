# Design System — Alzenins Platform

The brand already exists and it is good. These tokens were **extracted from the live site's
compiled stylesheet** (`/_next/static/css/*.css`), not invented. The platform extends this
language into product surfaces; it does not rebrand.

## 1. Colour tokens (verbatim from production)

| Token | Value | Role |
| --- | --- | --- |
| `--background` | `#faf7f1` | Warm paper cream — the page ground |
| `--foreground` | `#1b2a4a` | Deep indigo-navy — all body text |
| `--card` | `#fffdf9` | Near-white card surface, warmer than pure white |
| `--card-foreground` | `#1b2a4a` | |
| `--primary` | `#1b2a4a` | Navy — primary buttons, headings |
| `--primary-foreground` | `#ffffff` | |
| `--secondary` | `#34527f` | Lifted navy — gradients, secondary emphasis |
| `--secondary-foreground` | `#ffffff` | |
| `--accent` | `#d8a25d` | **Gold** — the signature. CTAs, highlights, active state |
| `--accent` (light) | `#e2b274` | Hover / gradient partner |
| `--accent-foreground` | `#fffaf2` | |
| `--muted` | `#ece5da` | Subdued fills, skeletons |
| `--muted-foreground` | `#52627f` | Secondary text |
| `--border` | `#d9d0c2` | Warm hairline |
| `--input` | `#f0e9df` | Field fill |
| `--ring` | `#a96f2d` | Focus ring — non-text, so the 3:1 UI-component threshold applies and it passes |
| `--accent-text` | `#7a4f1c` | **The only gold permitted for text.** See the correction below |
| `--radius` | `1rem` | Generous, soft corners throughout |

Supporting hues found in use: `#c8965a` / `#e8b87a` / `#f0cb8a` (gold ramp),
`#2e4a7a` / `#0d1b35` (navy ramp), `#9d174d` / `#d8546a` (rose — sakura accents).

**New tokens the platform needs** (extend, keep the warmth):

| Token | Value | Role |
| --- | --- | --- |
| `--success` | `#2f6f5a` | Paid, enrolled, present |
| `--warning` | `#b4762a` | Past due, low seats, expiring |
| `--danger` | `#a33240` | Failed payment, cancelled, absent |
| `--info` | `#34527f` | Reuse secondary |
| `--live` | `#d8546a` | "Class is live now" pulse |

Each needs a `-foreground` and a `-subtle` (10% tint on cream) variant for badges.

## 2. Typography

- **Latin:** Plus Jakarta Sans (`--font-plus-jakarta`), the `--font-sans` default.
- **Arabic:** Cairo (`--font-cairo`).
- The locale layer swaps the family; everything else in the scale is shared.

Scale (rem): `display 3.5 / h1 2.5 / h2 2 / h3 1.5 / h4 1.25 / body 1 / small 0.875 / caption 0.75`.
Arabic runs ~0.05rem larger at body sizes and needs ~1.7 line-height (vs 1.6) — Cairo's
ascenders and diacritics need the room.

Numerals: **Western Arabic digits (0–9) in both locales** for prices, dates, and times.
Eastern Arabic numerals in an RTL price row cause more confusion than they solve for a
GCC audience used to seeing `390 AED`.

## 3. RTL rules

1. Use logical properties everywhere: `ms-*`/`me-*`, `ps-*`/`pe-*`, `start-*`/`end-*`.
   Never `ml-`/`mr-`/`left-`/`right-` in shared components.
2. Icons that imply direction (arrows, chevrons, progress) mirror. Icons that depict objects
   (clock, calendar, play button, logo) do **not**.
3. Charts, timelines, and progress bars mirror their axis.
4. Media playback controls stay LTR — a video scrubber is a physical metaphor, not text.
5. Test every screen in both directions before it ships. Add an RTL snapshot to CI.

## 4. Component inventory

Built on shadcn/ui, restyled to the tokens above.

**Primitives** — Button (primary navy / accent gold / ghost / destructive), Input, Select,
Combobox, Checkbox, Radio, Switch, Textarea, Badge, Avatar, Tooltip, Dialog, Sheet, Popover,
Tabs, Accordion, Table, Pagination, Skeleton, Toast, Alert, Progress, Separator, Breadcrumb.

**Domain components** — the ones that carry the product:

| Component | Notes |
| --- | --- |
| `CourseCard` | Level badge, teacher avatars, schedule line, seats-left meter, price in the viewer's currency |
| `SeatMeter` | Filled/total bar; turns warning gold under 3 seats, danger under 1 |
| `PriceTag` | Currency-aware, shows `compare_at` strike-through, never converts client-side |
| `ScheduleStrip` | Horizontal day/time chips ("Mon · Wed · 18:00 GST") |
| `SessionCard` | Countdown, Join button that activates in a time window, teacher, materials link |
| `LiveNowBanner` | Sticky, pulsing `--live`, one-tap join |
| `BookingCalendar` | Month/week/agenda; slots in the student's timezone with the teacher's shown beneath |
| `AvailabilityEditor` | Teacher-side weekly grid, drag to paint availability, blackout overlay |
| `CreditBalancePill` | Sessions remaining + expiry warning |
| `LessonPlayer` | Signed-URL video, chapter list, resume position, materials rail, RTL-aware layout |
| `ProgressRing` | Course completion |
| `ProductGrid` / `CartDrawer` / `CheckoutSummary` | Store surfaces |
| `CurrencySwitcher` | Country-inferred default, manual override, shows charge currency when it differs |
| `EnrolmentTable` | Admin: roster, status, payment state, bulk actions |
| `StatCard` | Admin KPIs — MRR, active students, fill rate, churn |
| `EmptyState` | Illustrated, bilingual, always with the next action |

## 5. Motion & texture

The live site already uses soft blurred gradient blooms (`blur(80px)`–`blur(140px)`) and
warm drop shadows (`0 44px 80px rgba(200,150,90,0.28)`). Keep both — they are the brand's
signature and cost nothing to carry forward.

Sakura branch motifs stay as decorative section corners, never behind text.
Motion: 150–250ms, `ease-out` for entrances, `ease-in-out` for state changes.
Respect `prefers-reduced-motion` — kill the gradient drift and the live pulse.

## 6. Accessibility floor

- WCAG 2.1 AA. Gold `#d8a25d` on cream `#faf7f1` is **~1.9:1** — it is a *decoration and
  fill* colour, never small text. Gold-filled buttons take navy `#1b2a4a` text, not white.
- **Correction (2026-08-27, measured with Lighthouse).** An earlier version of this document
  said to use `#a96f2d` — the ring colour — for gold text. That was wrong, and it shipped:
  Lighthouse caught the home page's eyebrow badge at **3.32:1**. Measured properly,
  `#a96f2d` is **3.93:1 on cream** and **4.14:1 on card** — it fails AA for body text on
  every surface we have. The token `--accent-text` is now **`#7a4f1c`** (6.63:1 on cream).
  Do not reintroduce `#a96f2d` as a text colour; it remains correct for the focus ring,
  where the 3:1 UI-component threshold applies.
- Visible focus ring (`--ring`) on every interactive element; never `outline: none`.
- Full keyboard operation on the booking calendar and the video player.
- Every form field has a real `<label>`; errors are announced, not just coloured.
- Target size ≥ 44×44 px — the booking grid on mobile is the risk area.

## 7. Screen inventory (what actually gets designed)

**Public:** Home, Course listing, Course detail, Teacher profile, Store listing, Product
detail, Pricing/currency, About, Contact, Auth (sign in / OTP / register).

**Student:** Dashboard (next class + progress + quick actions), My schedule (calendar),
Session detail/join, Book a native speaker, My courses (recorded), Lesson player,
Materials library, Subscription & billing, Order history, Profile & preferences.

**Teacher:** Today, My cohorts, Roster & attendance, Availability editor, Bookings,
Upload materials, Earnings summary.

**Admin:** Overview KPIs, Cohorts & seats, Enrolments, Students, Teachers, Catalogue
(products/prices/currencies), Store orders & inventory, Subscriptions & dunning,
Discounts, Content manager, Settings, Audit log.

**Transactional:** Welcome, Purchase receipt, Enrolment confirmed, Class reminder (24h/1h),
Booking confirmed/cancelled, Payment failed (dunning ×3), Subscription ending,
Waitlist promoted, Order shipped. All in `ar` + `en`.
