# Phase 1 — Foundation

**Goal:** a deployed, bilingual, authenticated shell with the design system in place.
No commerce yet — but a real person can register, sign in, set their profile, and see an
empty dashboard, in Arabic, on a phone.

**Estimate:** 2–3 weeks · **Depends on:** Phase 0 · **Status:** `In progress`

> Started before Phase 0 was signed off, at the owner's decision. Phase 1 depends on
> none of the ten open questions; they gate Phase 2 onward. Recorded in the journal.

### Progress

Done: repo + tooling (Next 16 / React 19 / Tailwind v4 / TS strict), brand tokens,
`Button`/`Input` primitives, next-intl ar/en routing with RTL, header/footer/locale
switcher, Arabic home page, legacy 301s, Drizzle identity schema + migration +
idempotent seed, Docker Postgres, `db:*` scripts, **Auth.js with email OTP + optional
Google, `requireUser()`/`requireRole()` guards, proxy route protection, two-step
sign-in, profile page with a server action, `/admin` guard placeholder**.

Acceptance criteria met so far: registration and sign-in land on the dashboard;
locale switching flips the whole UI; an admin-only route refuses a student
server-side; the database rebuilds from migrations + seed in one command.

Also done: marketing pages, 20 UI primitives on Radix, `/dev/kitchen-sink` gallery,
27 Playwright E2E tests (auth, contact, i18n, redirects, 14 RTL checks), Sentry and
PostHog (both inert without keys), Lighthouse measured and asserted in CI.

**Acceptance criteria: 7 of 8 met.** Lighthouse is 93/100/100/91 on `/ar` and `/en`,
redirects are covered by E2E, and RTL has behavioural cover in CI.

**Remaining: staging, preview and production environments.** These need accounts and
credentials only the owner can create — see [`deployment.md`](../deployment.md).
Phase 1 cannot be signed off until staging exists, because the sign-off ritual is a
live demo on staging.

## In scope

### Repo & tooling
- Next.js App Router + TypeScript, strict mode, path aliases
- Tailwind configured with the extracted brand tokens (see `design-system.md`)
- ESLint + Prettier + `tsc --noEmit` in CI; Vitest for unit, Playwright for E2E
- Drizzle + Postgres, migration workflow, seed script
- Environments: local / preview / staging / production, with env-var validation at boot
- Sentry + PostHog wired
- CI: typecheck, lint, unit, migration dry-run, Playwright smoke, preview deploy

### Design system
- All tokens as CSS custom properties, light theme (dark theme deferred — note it)
- shadcn/ui installed and restyled; Storybook or a `/dev/kitchen-sink` route
- The 20 primitives from the component inventory, each with an RTL story
- Logical-property lint rule banning `ml-`/`mr-`/`left-`/`right-` in `src/components`

### i18n & RTL
- `next-intl` with `/[locale]` routing, `ar` default, `en` secondary
- `dir` attribute driven by locale; font family swap (Cairo ↔ Plus Jakarta Sans)
- Message catalogues with a CI check for missing keys in either locale
- Locale-aware date, time, and number formatting; timezone-aware rendering helper

### Auth & profiles
- Auth.js v5: email OTP (magic code, not magic link — better on mobile in MENA) + Google
- `user`, `session`, `account`, `verification_token` tables in our Postgres
- Roles: `student` | `teacher` | `admin` | `owner`; middleware guard + a server-side
  `requireRole()` re-check used by every protected server action
- Profile page: name, avatar, locale, country, timezone (auto-detected, overridable), phone
- Rate limiting on auth endpoints

### Marketing pages ported
- Home, Courses, About, Contact rebuilt on the new design system, content preserved,
  SEO metadata and OG tags carried over, redirects mapped from old URLs

## Out of scope

Products, prices, payments, classes, bookings, video. All of it.

## Acceptance criteria

- [ ] A new user registers with an email OTP and lands on an empty dashboard
- [ ] Switching to English flips the entire UI to LTR with no layout breakage
- [ ] The marketing pages render identically-or-better vs the current live site
- [ ] Lighthouse ≥ 90 on performance, accessibility, and SEO for `/ar` and `/en` home
- [ ] An admin-role user sees `/admin`; a student-role user gets a 403, verified server-side
- [ ] CI blocks a PR with a type error, a lint error, or a missing translation key
- [ ] A destroyed local database rebuilds from migrations + seed in one command
- [ ] Every primitive component has an RTL snapshot in CI

## Sign-off checklist

**The walkthrough lives in [`phase-1-signoff.md`](phase-1-signoff.md)** — 23 automated
checks against staging plus seven manual steps that cannot be automated against a real
deployment.

- [ ] All acceptance criteria demonstrated live on staging
- [ ] Old-URL redirects verified for every existing indexed page
- [ ] Secrets present in all four environments, none in the repo
- [ ] `README.md` documents local setup end to end, and a fresh clone was tested against it

## Sign-off

| Field | Value |
| --- | --- |
| Owner | |
| Date | |
| Carve-outs | |
