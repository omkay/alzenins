# ADR-0002 — PostgreSQL + Drizzle + Auth.js, with the user record in our own database

| Field | Value |
| --- | --- |
| Status | Proposed |
| Date | 2026-08-26 |
| Deciders | Engineering |

## Context

The domain is relational and full of invariants that must hold under concurrency: a cohort
cannot oversell, a credit balance cannot go negative, a slot cannot be double-booked, an
order must fulfil exactly once. We also need auth, and the tempting shortcut is a
managed auth vendor that owns the user record.

## Decision

- **PostgreSQL** as the primary store. Managed (Neon or Supabase); either is fine, the
  choice is operational, not architectural.
- **Drizzle** as the ORM. Explicit SQL, real transactions, and `SELECT ... FOR UPDATE`
  available without fighting the abstraction — which seat and slot allocation require.
- **Auth.js (NextAuth) v5** with its adapter tables **in our Postgres**. Email OTP codes
  (not magic links — codes survive in-app browsers and WhatsApp-forwarded links, which
  matters in this market) plus Google sign-in.
- The `user` row is ours. Every other table foreign-keys to it.

## Rejected

- **Auth vendor owning identity** (Clerk, Auth0, Supabase Auth as the source of truth).
  Convenient, but it puts a network call and a foreign ID between us and every join in the
  system, and makes "export the business" a migration project. Not worth it at this size.
- **Prisma.** Good DX; weaker story for explicit locking and raw SQL escape hatches, which
  this domain leans on.
- **A document store.** The invariants above are precisely what relational integrity is for.

## Consequences

- We own migrations, backups, and connection pooling. Use the platform's pooler; serverless
  + Postgres needs it.
- Row locks are available where correctness demands them.
- Auth.js v5 is comparatively lightly documented; budget a day for the OTP flow.
- Reporting can be plain SQL against the same database until volume says otherwise.
