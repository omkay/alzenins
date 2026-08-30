# Spike — MamoPay sandbox

**Date:** 2026-08-30 · **Phase:** 2, before any adapter code
**Why:** `AGENTS.md` §3.6 — don't guess integration behaviour. `phase-2` lists
"MamoPay API surface differs from the docs" as the top risk.

Every shape below was observed against
`https://sandbox.dev.business.mamopay.com/manage_api/v1`, not read from docs.

---

## The finding that changes the plan

**MamoPay accepts twelve currencies, not twenty-eight.**

```
POST /links  {"amount_currency": "JPY", ...}
→ 422 VALIDATION_ERROR
  "Currency must be AED, EUR, GBP, RON, SAR, TRY, USD, AUD, CAD, CHF, DZD, EGP"
```

Mamo's published material says 28. The API says 12. **QAR is not among them** —
and ADR-0003 had Qatar in the covered column.

### Impact

| | Before the spike | After |
| --- | --- | --- |
| Markets chargeable in their own currency | 8 of 16 | **7 of 16** |
| Markets needing a fallback | 8 | **9** |
| Qatar | QAR direct | **charged in AED** |

Had this not been caught, Qatar would have had an authored QAR price that failed
at the payment step — a market silently unable to buy.

QAR and AED are both dollar-pegged, so AED keeps the charged number stable.

### Open question for Mamo

Is the twelve-currency list a **sandbox restriction or the real one?** The code
now uses the observed list, because shipping a price that fails at checkout is
worse than showing a fallback unnecessarily. **Get this in writing before the
price books are authored.**

---

## Observed shapes

### Create a payment link

`POST /links` → **201**

Request that worked:

```json
{
  "title": "Japanese Diploma — monthly",
  "description": "…",
  "amount": 390,
  "amount_currency": "AED",
  "return_url": "https://…/ar/checkout/return",
  "failure_return_url": "https://…/ar/checkout/failed",
  "external_id": "spike-0001",
  "lang": "ar",
  "capacity": 1,
  "custom_data": { "order_id": "01JXYZ" }
}
```

Response fields that matter:

| Field | Example | Use |
| --- | --- | --- |
| `id` | `MB-LINK-7CA3D0BDB0` | The provider reference — store as `order.provider_ref` |
| `payment_url` | `https://sandbox…/pay/alzenins-3636ec7b9491` | Where to redirect the student |
| `external_id` | `spike-0001` | **Our** id, echoed back. The correlation key |
| `custom_data` | `{"order_id": "01JXYZ"}` | Arbitrary metadata, round-trips intact |
| `lang` | `ar` | **Arabic checkout is supported** — send the student's locale |
| `capacity` | `1` | Single-use link. Correct for a one-off order |
| `subscription` | `null` | Subscriptions attach to a link; shape still to be probed (Phase 4) |
| `payment_methods` | `["card","wallet"]` | |
| `save_card` | `"off"` | Relevant to recurring — Phase 4 |

### Amounts are decimal, not minor units

`"amount": 390` came back as `390.0`. **A float.**

Our data model stores `amount_minor` as a bigint, deliberately, because floats
lose money. The adapter must convert at the boundary and **never** let a float
back into our tables:

```
our amount_minor (39000)  →  ÷100  →  Mamo amount (390.0)
```

Two-decimal currencies are fine. Watch the three-decimal ones — we do not
charge in KWD/BHD/OMR/JOD, they all fall back to AED, which sidesteps it.

### Error shape

```json
{
  "messages": ["See errors"],
  "error_code": "VALIDATION_ERROR",
  "errors": ["Currency must be AED, …"]
}
```

`error_code` is the branchable field. `errors[]` is human-readable detail.

### List links

`GET /links` → `{ "data": [...], "pagination_meta": { page, per_page, total_pages, next_page, prev_page, from, to, total_count } }`

Pagination is an envelope, not headers.

---

## Still to probe before building

- [ ] **Subscription creation** — the `subscription` field on a link, and what a
      recurring charge event looks like. Blocks Phase 4.
- [ ] **Webhook payload and signature verification.** The single most important
      unknown: our whole idempotency design assumes a stable event id.
- [ ] **Refunds** — endpoint and whether partial is supported.
- [ ] **Settlement reporting** — what reconciles a charge to an AED payout.
- [ ] Whether `capacity` genuinely prevents a second payment on the same link.

## Cleanup

Spike links created in the sandbox: `MB-LINK-7CA3D0BDB0` (AED),
`MB-LINK-ECD9FF8935` (SAR). Sandbox only — no real money moved.
