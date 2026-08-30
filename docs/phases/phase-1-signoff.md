# Phase 1 — Sign-off checklist

**Environment:** <https://alzenins-staging-467926779679.me-central1.run.app>
**Run the automated part first:** `cd code && pnpm test:e2e:staging`

The eight acceptance criteria from [`phase-1-foundation.md`](phase-1-foundation.md), split by
what a machine can prove and what a person has to do.

---

## Automated — 23 checks, run against staging

`pnpm test:e2e:staging` covers:

- [x] All seven public pages return 200 in both locales
- [x] `/` negotiates from `Accept-Language` — Arabic browser → `/ar` (RTL), English → `/en` (LTR)
- [x] The locale switcher keeps you on the same page
- [x] `400+` does not reverse under RTL
- [x] `hreflang` is absolute and points at this environment
- [x] All four legacy brochure URLs redirect
- [x] `/dashboard` and `/admin` refuse a signed-out visitor
- [x] `/dev/kitchen-sink` returns 404 — the localhost guard holds on a real host
- [x] Sign-in renders and requesting a code reaches the code step
- [x] The contact form accepts a message

## Manual — what cannot be automated against a deployment

**Why:** the sign-in code goes to a real inbox. The E2E file sink is deliberately gated to a
localhost `APP_URL`, and Auth.js hashes the token in the database, so there is no way for a
test to read it from a deployed environment. This is the security design working, not a gap
in coverage.

- [ ] **1. Sign in end to end.** `/ar/sign-in` → enter `theczar333@gmail.com` → take the code
      from the inbox → land on the dashboard with your name in the header.
- [ ] **2. Profile round-trip.** Change name, locale, country and timezone; save; reload and
      confirm they persisted. Setting country to Japan should say prices show in JPY but the
      charge is in another currency.
- [ ] **3. Locale flip while signed in.** Switch to English and back; the whole UI flips
      direction with no layout breakage and the session survives.
- [ ] **4. Admin refusal for a signed-in student.** While signed in, open `/ar/admin`. It
      should bounce you home — this is the server-side role re-check, not the proxy.
- [ ] **5. Sign out.** The header returns to "sign in", and `/ar/dashboard` redirects.
- [ ] **6. On a phone.** Repeat 1 and 2 on a real handset in Arabic. Tap targets, the code
      field, and the RTL layout are the things to watch.
- [ ] **7. Marketing pages read correctly.** Compare against the live site — the content is
      rebuilt, not copied, so this is a read-through for tone and accuracy.

## Known limits at sign-off

Record these as carve-outs rather than pretending they are done.

| Limit | Impact | Where it is tracked |
| --- | --- | --- |
| Resend's shared sender only delivers to the Resend account owner | **Nobody but the owner can sign in to staging.** Do not ask the instructors to try it until `alzenins.com` is verified | Phase 9 cutover |
| No preview or production environment | Per-PR deploys and production are not set up | `deployment.md` |
| Dark theme not built | Light only; the token layer is structured for it | Phase 1 scope note |
| Lighthouse measured locally, asserted in CI, not measured on staging | Cloud Run cold starts make a single staging run unrepresentative | CI |

## Sign-off

| Field | Value |
| --- | --- |
| Owner | |
| Date | |
| Carve-outs accepted | |
