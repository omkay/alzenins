# Deployment & Environments

## Status

| Environment | State | Notes |
| --- | --- | --- |
| `local` | ✅ Working | Docker Postgres on 5433, `pnpm dev` |
| `preview` | ⛔ Not set up | Needs a hosting account — see below |
| `staging` | ⛔ Not set up | Blocks the Phase 1 sign-off demo |
| `production` | ⛔ Not set up | |

**Preview, staging and production cannot be created from this repo alone** — they need
accounts and credentials only the owner can create. Everything the app needs is listed
below so it is a form-filling exercise rather than a discovery one.

## What staging needs

1. **A host.** Vercel is the assumed target (the app is Next.js and the plan says so), but
   nothing here is Vercel-specific — `trustHost` is set explicitly precisely so a container
   on any host works. Root directory must be set to **`code/`**.
2. **A Postgres database.** Neon or Supabase; a separate branch/instance from production.
3. **Environment variables** — the full set is in [`code/.env.example`](../code/.env.example):

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Pooled connection string |
| `AUTH_SECRET` | ✅ | `openssl rand -base64 32`, different per environment |
| `APP_URL` | ✅ | The environment's own origin. Drives `metadataBase`, hreflang, and the localhost-only guards |
| `RESEND_API_KEY` | ✅ on staging/prod | Without it, production throws rather than silently not sending sign-in codes |
| `EMAIL_FROM` | ✅ | Must be a verified Resend sender |
| `MAMOPAY_API_KEY` | Phase 2 | Sandbox key on staging, live key on production only |
| `MAMOPAY_ENV` | Phase 2 | `sandbox` or `production` |
| `AUTH_GOOGLE_ID` / `_SECRET` | Optional | Omit both and the Google button disappears |
| `NEXT_PUBLIC_SENTRY_DSN` | Recommended | Absent disables Sentry entirely |
| `SENTRY_ENVIRONMENT` | Recommended | `staging` / `production` — drives the trace sample rate |
| `NEXT_PUBLIC_POSTHOG_KEY` | Recommended | Absent disables analytics entirely |
| `NEXT_PUBLIC_POSTHOG_HOST` | Optional | Defaults to the EU host |

4. **Migrations on deploy.** Run `pnpm db:migrate` before the new build takes traffic.
   Migrations are forward-only.

## Guards that key on `APP_URL`

Two things are enabled only when `APP_URL` starts with `http://localhost`:

- the E2E sign-in-code file sink (`E2E_OTP_SINK`), and
- the `/dev/kitchen-sink` component gallery.

`NODE_ENV` cannot be the gate, because the E2E suite deliberately runs a production build.
**Setting `APP_URL` to a localhost value on a deployed environment would expose both** —
it is the one variable to get right.

## Verified locally, not yet in an environment

Lighthouse on the production build, Chrome headless:

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/ar` | 93 | 100 | 100 | 91 |
| `/en` | 93 | 100 | 100 | 91 |
| `/ar/courses` | 91 | 100 | 100 | 91 |

CI asserts these on every pull request (accessibility at 100, the rest at 90).
