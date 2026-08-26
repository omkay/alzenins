# Alzenins Platform

Turning [alzenins.com](https://alzenins.com) — مركز الزين, a UAE language-training centre —
from a marketing site into a full learning platform: live classes, subscriptions, 1:1 booking
with native speakers, recorded courses, and a store, across 16 markets in Arabic and English.

**This repo currently contains planning and design documentation only. No application code yet.**

## Start here

| If you are… | Read |
| --- | --- |
| An agent picking up work | **[`AGENTS.md`](AGENTS.md)** — rules, context index, current status |
| Understanding the product | [`docs/product-brief.md`](docs/product-brief.md) |
| Looking for the plan | [`docs/roadmap.md`](docs/roadmap.md) |
| Building something | [`docs/architecture.md`](docs/architecture.md) + [`docs/data-model.md`](docs/data-model.md) |
| Designing something | [`docs/design-system.md`](docs/design-system.md) |
| Asking "why is it like this?" | [`docs/decisions/`](docs/decisions/) |
| Asking "what happened recently?" | [`docs/journal/`](docs/journal/) |

## The plan in one table

| # | Phase | Est. |
| --- | --- | --- |
| 0 | Discovery & Sign-off | 1 wk |
| 1 | Foundation — repo, design system, i18n/RTL, auth, profiles | 2–3 wks |
| 2 | Catalogue & Payments — multi-currency price books, MamoPay | 3–4 wks |
| 3 | Live Classes & Calendar — cohorts, seats, Zoom, reminders | 3–4 wks |
| 4 | Subscriptions & Entitlements — recurring billing, dunning | 2–3 wks |
| 5 | 1:1 Booking — availability, credits, bookings | 2–3 wks |
| 6 | Recorded Courses — video, materials, progress | 3 wks |
| 7 | Store — inventory, discounts, shipping | 2–3 wks |
| 8 | Admin & Operations — dashboard, reporting, teacher tools | 2–3 wks |
| 9 | Hardening & Launch | 2 wks |

~5–7 months to the full platform. **Phases 1→4 (~3–4 months) are a shippable product on
their own** — the current business, fully automated.

## Working agreement

1. One phase at a time; nothing starts before the previous phase is signed off.
2. Every working session ends with a journal entry in `docs/journal/YYYY-MM-DD.md`.
3. Every expensive-to-reverse decision becomes an ADR in `docs/decisions/`.
4. Arabic and RTL are first-class from day one, not a retrofit.

Full detail in [`AGENTS.md`](AGENTS.md).
