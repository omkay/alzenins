# Deployment & Environments

## Status

| Environment | State | Notes |
| --- | --- | --- |
| `local` | ✅ Working | Docker Postgres on 5433, `pnpm dev` |
| `preview` | ⛔ Not set up | Per-PR deploys, deferred |
| `staging` | 🟡 **Deployed, needs a database** | <https://alzenins-staging-467926779679.me-central1.run.app> |
| `production` | ⛔ Not set up | |

## Staging — GCP Cloud Run

| Item | Value |
| --- | --- |
| Project | `alzenins-staging` (project number `467926779679`) |
| Region | `me-central1` (Doha) — closest to the UAE/GCC audience, ~10–30ms from the Gulf |
| Service | `alzenins-staging`, Cloud Run, 1 vCPU / 512Mi, min 0 / max 3 instances |
| Image | `me-central1-docker.pkg.dev/alzenins-staging/app/alzenins-staging` |
| Database | Neon project `alzenins` (`dry-art-50774076`), org `org-muddy-recipe-61569948` |
| Neon branch | **`staging`** (`br-cold-sky-ae8v7c71`), branched from `production` |
| Secrets | Secret Manager: `AUTH_SECRET`, `DATABASE_URL` (the pooled staging connection) |

### Neon branches

| Branch | Used by |
| --- | --- |
| `production` | Reserved. Nothing points at it yet. |
| `staging` | The Cloud Run service |
| — | Local development stays on Docker Postgres, not Neon |

Postgres is the **only** Neon service this app uses. Neon Auth, the Data API,
Object Storage, Functions and the AI Gateway are all available on the project and
all deliberately unused: authentication is Auth.js against our own `user` table
([ADR-0002](decisions/ADR-0002-postgres-drizzle-authjs.md)), and nothing else has
a requirement yet. There is no `neon.ts`, because there is nothing to declare.

`neon link` writes the linked branch's `DATABASE_URL` into `code/.env`. Local
tooling must not pick that up, so `drizzle.config.ts` and the seed load
`.env.local` **before** `.env`, matching Next's own precedence. Without that,
`pnpm db:migrate` would silently target Neon instead of Docker.

Migrations run against the **direct** (unpooled) connection; the app uses the
**pooled** one.

Scale-to-zero means staging costs essentially nothing when idle, at the price of a cold
start on the first request.

### Rebuild and redeploy

```bash
cd code
gcloud builds submit --config=cloudbuild.yaml --region=me-central1 \
  --substitutions=_APP_URL=https://alzenins-staging-467926779679.me-central1.run.app,SHORT_SHA=$(git rev-parse --short HEAD)

gcloud run deploy alzenins-staging --region=me-central1 \
  --image=me-central1-docker.pkg.dev/alzenins-staging/app/alzenins-staging:latest
```

`APP_URL` is a **build argument, not just a runtime variable**: `metadataBase` and the
hreflang alternates are resolved at build time for the statically rendered pages. Changing
the hostname means rebuilding, not just redeploying.

### Outstanding

**`DATABASE_URL` is a placeholder.** Anything that touches the database — sign-in, profile,
the contact form — returns 500 until a real Neon connection string is stored. Static pages,
the locale proxy, the route guards and the legacy redirects all work already.

## Environment variables

The full set is in [`code/.env.example`](../code/.env.example):

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

## Migrations

Run `pnpm db:migrate` against the target database **before** the new revision takes
traffic. Migrations are forward-only. The runtime image deliberately ships without
drizzle-kit, so this runs from a developer machine or a CI step, not from the container.

## Guards that key on `APP_URL`

Two things are enabled only when `APP_URL` starts with `http://localhost`:

- the E2E sign-in-code file sink (`E2E_OTP_SINK`), and
- the `/dev/kitchen-sink` component gallery.

`NODE_ENV` cannot be the gate, because the E2E suite deliberately runs a production build.
**Setting `APP_URL` to a localhost value on a deployed environment would expose both** —
it is the one variable to get right.

## Verified on staging

| Check | Result |
| --- | --- |
| `/` → `/ar` | 307 ✅ |
| `/ar`, `/en`, `/ar/courses`, `/ar/about` | 200 ✅ |
| `/courses` → `/ar/courses` | 308 ✅ legacy redirect |
| `/ar/dashboard` signed out | 302 → sign-in with callback ✅ |
| `/ar/dev/kitchen-sink` | **404** ✅ the localhost guard holds on a real host |
| `/api/auth/csrf` | returns a token ✅ confirms the `trustHost` fix |
| Arabic renders with `dir="rtl"`, absolute hreflang | ✅ |
| Anything database-backed | ❌ 500 until `DATABASE_URL` is real |

## Lighthouse, measured locally on the production build

Chrome headless:

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/ar` | 93 | 100 | 100 | 91 |
| `/en` | 93 | 100 | 100 | 91 |
| `/ar/courses` | 91 | 100 | 100 | 91 |

CI asserts these on every pull request (accessibility at 100, the rest at 90).
