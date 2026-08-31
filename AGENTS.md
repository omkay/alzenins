# AGENTS.md — Alzenins Platform

**Read this file first.** It is the entry point for every agent and human working in this repo.
It tells you where context lives, how to record what you did, and the rules you must not break.

---

## 1. What we are building

Alzenins (مركز الزين) is a UAE-based language-learning centre, currently teaching Japanese
online (Zoom, twice weekly) with ~400 students since 2020. The live site is a Next.js
marketing brochure at <https://alzenins.com>.

We are turning it into a **full language-training platform**:

| Capability | Summary |
| --- | --- |
| Live online classes | Cohort + 1:1 sessions delivered over Zoom/Meet, bookable and paid online |
| Seat management | Admin dashboard controlling class capacity, waitlists, teacher assignment |
| Subscriptions | Recurring monthly/termly memberships with entitlements |
| Booking with natives | Credit-based 1:1 booking against native-speaker availability |
| Calendar | Availability, scheduling, reschedules, reminders, ICS/Google sync |
| Auth & profiles | Accounts, roles (student/teacher/admin), profile & learning history |
| Store | Curated **digital** catalogue, discounts, order management. No physical goods |
| Product admin | Full CRUD on courses/products/prices from the dashboard |
| Multi-currency | GCC + Levant + North Africa + Japan/EU/US. Display and charge currency are separate — MamoPay covers only 8 of 16 (ADR-0003) |
| Payments | MamoPay only in v1 behind a `PaymentProvider` port; uncovered markets get a fallback charge currency (ADR-0003 Option A) |
| Recorded courses | Video + downloadable materials gated by subscription or one-off purchase |

Full detail: [`docs/product-brief.md`](docs/product-brief.md).

---

## 2. Where context lives

```
AGENTS.md                  ← you are here; rules + index
README.md                  ← human-facing quick start
docs/
  product-brief.md         ← scope, personas, non-goals
  architecture.md          ← system design, stack, boundaries, integrations
  data-model.md            ← entities, relationships, key invariants
  design-system.md         ← brand tokens extracted from the live site, UI rules
  roadmap.md               ← the phase plan + sign-off gates (THE plan)
  phases/phase-N-*.md      ← one file per phase: scope, tasks, acceptance criteria
  decisions/ADR-NNNN-*.md  ← architecture decision records (immutable once accepted)
  journal/YYYY-MM-DD.md    ← daily log of work done + decisions taken
  design/                  ← design explorations, screen inventories, canvas links
```

---

## 3. Working rules

### 3.1 Journal every working session — non-negotiable

At the **end of every session** in which you changed anything (code, docs, decisions),
append to `docs/journal/YYYY-MM-DD.md` using the template in
[`docs/journal/_TEMPLATE.md`](docs/journal/_TEMPLATE.md). Create the file if today's
does not exist. Never rewrite a previous day's entry — append a correction instead.

An entry must answer: what changed, why, what was decided, what is now blocked or open.
Write it for an agent who has zero memory of this conversation.

### 3.2 Decisions go in ADRs

Any choice that is expensive to reverse — a vendor, a schema shape, an auth model, a
currency strategy — gets an ADR in `docs/decisions/`. Copy
[`docs/decisions/_TEMPLATE.md`](docs/decisions/_TEMPLATE.md). Number sequentially.
Once an ADR is `Accepted`, do not edit it; supersede it with a new one and link both ways.

### 3.3 Phase discipline

Work happens **one phase at a time**. A phase is not finished until every box in its
"Sign-off checklist" is ticked and the owner has signed off in the phase file.
Do not start Phase N+1 work while Phase N is unsigned. If you find Phase N+1 work that
must happen early, say so and get it moved explicitly — do not smuggle it in.

### 3.4 Money, seats, and entitlements are the sharp edges

- Never trust a client-supplied price, currency, or entitlement. Resolve server-side.
- Every payment mutation must be **idempotent** and keyed. Webhooks arrive twice.
- Seat allocation must hold under concurrency — use a DB transaction with a real lock,
  not a read-then-write.
- Never store raw card data. Ever. The payment provider holds it.

### 3.5 Bilingual and RTL from day one

Every string is translated (`ar` + `en`). Every layout is tested in RTL. Arabic is not
a retrofit — it is the primary market language. No hardcoded user-facing strings.

### 3.6 Don't guess integration behaviour

MamoPay, Zoom, and the video host each have real, checkable docs. If you're unsure what
an API returns, read the docs or hit the sandbox — do not invent field names and move on.
Record what you learned in the journal so the next agent doesn't repeat the lookup.

---

## 4. Current status

| Field | Value |
| --- | --- |
| Active phase | **Phase 1 awaiting sign-off** ([walkthrough](docs/phases/phase-1-signoff.md)) · **Phase 2 starting** |
| Phase 0 | Partially answered 2026-08-27 — currency fallback (ADR-0003 Option A), MamoPay sandbox key, VAT (ADR-0007), digital-only store. **Phase 2 is unblocked.** Six questions remain, gating Phases 3, 7 and 9. |
| Repo state | Next.js 16 app in `code/`, **deployed to staging** on Cloud Run + Neon + Resend. Design system, ar/en RTL, Auth.js email OTP with role guards, rate limiting, profiles, marketing pages, 20 primitives, 27 local E2E + 23 staging checks, Sentry/PostHog, CI with Lighthouse. |
| Blocking decisions | See [open questions](docs/roadmap.md#open-questions) — six still open, none blocking Phase 2 |

Update this table whenever the active phase changes.

## 5. Running it locally

```bash
docker compose up -d          # Postgres 17 on port 5433
cd code && pnpm install
cp .env.example .env.local && cp .env.example .env
pnpm db:migrate && pnpm db:seed
pnpm dev                      # http://localhost:3000/ar
```

`pnpm db:reset` wipes and rebuilds the database from migrations + seed.
Before opening a PR: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.

Staging: <https://alzenins-staging-467926779679.me-central1.run.app> —
`pnpm test:e2e:staging` runs 23 checks against it. See [`docs/deployment.md`](docs/deployment.md).
