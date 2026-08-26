# ADR-0001 — One Next.js application for marketing, student, teacher, and admin

| Field | Value |
| --- | --- |
| Status | Proposed |
| Date | 2026-08-26 |
| Deciders | Owner, engineering |

## Context

The platform has four distinct audiences. The existing site is already Next.js App Router
with Tailwind and shadcn-shaped tokens. The team is small (1–2 engineers). Marketing pages
need SEO and speed; the dashboards need interactivity and shared domain logic.

## Options considered

### A — One Next.js app, route groups per audience
`(marketing)`, `(student)`, `(teacher)`, `(admin)`. Shared components, shared domain layer,
one deploy, one auth session. Risk: bundle bloat and a large codebase over time.

### B — Separate marketing site and separate dashboard SPA
Cleaner separation. Costs: duplicated auth, duplicated design system, cross-origin session
handling, two deploy pipelines, two sets of env vars — for a two-person team.

### C — Next.js frontend + separate backend service (NestJS/Go)
Justified at real scale or with a mobile client needing a shared API. We have neither yet.

## Decision

**Option A.** One application, route groups per audience, domain logic in `src/server/<domain>`
with explicit module boundaries so extraction later is mechanical rather than archaeological.

## Consequences

- Fast: one auth model, one design system, one deploy.
- Requires discipline: domains talk through exported functions, never by reaching into each
  other's tables. Enforce with an import-boundary lint rule.
- Admin bundle size must be watched; keep admin routes dynamically imported and out of the
  marketing bundle.
- Revisit if we build a native mobile app, or if admin and student traffic need to scale
  or deploy independently.
