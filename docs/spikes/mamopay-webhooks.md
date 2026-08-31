# Spike — MamoPay webhooks, subscriptions, refunds

**Date:** 2026-08-31 · **Phase:** 2, before any adapter code
**Why:** the 2026-08-30 spike left five unknowns. The first of them —
webhook payload and signature — was the one the whole idempotency design
rested on. It turned out the design rested on something that does not exist.

Everything below was observed against
`https://sandbox.dev.business.mamopay.com/manage_api/v1`. Nothing is from docs.

---

## The finding that changes the design

### MamoPay does not sign its webhooks.

There is no HMAC, no signature header, no timestamp, no event id in the
transport. A delivery carries exactly this:

```
accept, accept-encoding, authorization, baggage, content-length, content-type,
forwarded, host, sentry-trace, traceparent, user-agent (Faraday v1.10.4),
x-cloud-trace-context, x-forwarded-{for,host,port,proto}
```

`baggage` / `sentry-trace` / `traceparent` are **Mamo's own** Sentry and
OpenTelemetry propagation headers, not ours. They are not stable identifiers and
must not be used as one.

Instead, `POST /webhooks` accepts an **`auth_header`** field: a string we choose,
which Mamo sends back verbatim in the `Authorization` header of every delivery.

```json
POST /webhooks
{ "url": "...", "enabled_events": ["charge.succeeded"], "auth_header": "..." }
→ 201 { "id": "MPB-WH-9830360B11", "url": "...", "enabled_events": [...], "auth_header": "..." }
```

### What that means for us

| We assumed | Reality | Consequence |
| --- | --- | --- |
| HMAC signature over the body | A static shared bearer | Verification is a **constant-time string compare**, not a digest check |
| Signature proves integrity | Nothing proves integrity | A tampered body with the right header verifies. Trust the *event*, not the *amounts* in it |
| Signature proves freshness | Nothing proves freshness | Deliveries are **replayable forever** by anyone who has seen the header |
| A stable event id in the transport | None | Idempotency **must** key on something in the payload — still unobserved |

Three rules follow, and they are not optional:

1. **Never trust the body's numbers.** On `charge.succeeded`, re-fetch the charge
   from the API by id and use *that* amount, currency and status to grant
   anything. The webhook is a doorbell, not a delivery.
2. **`auth_header` is a password.** Secret Manager, never the repo, never a log.
   It is returned in **plaintext** by `GET /webhooks`, so anyone holding the API
   key holds it too — it is not a second factor.
3. **Never log the `Authorization` header.** Our probe route logs header *names*
   and withholds values for exactly this reason.

### Registration probes the URL. Live.

`POST /webhooks` refuses with `"Webhook is unreachable"` unless the URL answers.
The probe is:

```
POST <your url>   {"ping":"pong"}    User-Agent: Faraday v1.10.4
```

So the endpoint must be **deployed and answering 200 before it can be
registered** — there is no register-then-build order. It also means the ping
arrives with no auth on some paths; the receiver must tolerate `{"ping":"pong"}`
without treating it as an event.

### The event catalogue (observed, from the validation error)

```
charge.succeeded          charge.failed           charge.authorized
charge.voided             charge.refund_initiated charge.refunded
charge.refund_failed      charge.card_verified
payment.succeeded         payment.failed          payment.authorized
payment.voided            payment.refund_initiated payment.refunded
payment.refund_failed     payment.card_verified
subscription.succeeded    subscription.failed
payout.processed          payout.failed
payment_link.create       card_transaction.create card_transaction.update
expense.create            expense.update
```

**`charge.*` and `payment.*` mirror each other exactly.** Whether they are
aliases or two different objects is unknown; `GET /charges` and `GET /payments`
are both live collections with the same envelope. **Subscribe to one family
only** until this is settled, or every event may be handled twice.

---

## Subscriptions

The `subscription` object attaches to a link at creation.

```json
"subscription": { "frequency": "monthly", "frequency_interval": 1 }
→ "subscription": {
     "identifier": "MPB-SUB-AA9AEE7D6E",
     "frequency": "month",          ← NOTE
     "frequency_interval": 1,
     "payment_quantity": null, "start_date": null, "end_date": null,
     "monthly_start_date": null, "weekly_start_day": null
   }
```

| Observation | Why it matters |
| --- | --- |
| `frequency` in is `monthly`; **out it is `month`** | The input and output enums differ. Never feed Mamo's own response back to it. Map both directions explicitly. |
| Valid input: `test, annually, weekly, monthly` | **No quarterly.** But `frequency_interval: 3` + `monthly` gives a **termly** subscription, which is what the product brief actually needs. Verified: interval 3 is accepted and echoed. |
| `payment_quantity: 6` accepted | A **bounded** subscription — six charges then stop. This is the honest shape for "6 months prepaid, paid monthly". |
| `identifier` `MPB-SUB-…` | Stable subscription id. Store it. |
| `subscription: true` → **500** | A non-object crashes their API. The adapter must never send a scalar here. |
| `capacity` is **silently dropped** on a subscription link | Seat limiting cannot lean on Mamo. It never could — AGENTS.md §3.4 — but now there is no temptation. |

---

## Refunds

`POST /charges/{id}/refunds` — **plural**. It exists: a bogus id returns
`RECORD_NOT_FOUND` with a charge-specific message, where a route that does not
exist returns a bare `NOT_FOUND`. There is no `/refunds` collection.
Body shape and partial-refund support are unknown until a real charge exists.

## Settlement

`GET /payouts` → `[]`. A bare array, **not** the `pagination_meta` envelope that
`/links`, `/charges` and `/payments` use. Two response conventions in one API;
the client must not assume an envelope.

`payout.processed` / `payout.failed` are the reconciliation events.

---

## Traps confirmed by experiment

### Unknown fields are silently dropped, and you still get a 201.

```
POST /links {"externalId": "camelCase-typo", "capacty": 1, ...}
→ 201, external_id: null, capacity: null
```

A mistyped `external_id` produces a live payment link with **no correlation key**
and no error. The adapter must assert, after every create, that the fields it
cares about came back — `external_id` above all.

### `DELETE /links/{id}` is a deactivation, not a delete.

```
DELETE → {"success": true}      then GET /links still lists it, active: false
```

`GET /links` returns inactive links. It is not a list of live links.

### Amounts are floats (carried over from 2026-08-30)

`"amount": 390` returns as `390.0`. Convert at the boundary; never let a float
into our tables.

### `GET /me` is a cheap identity check

`{"business_name":"Alzen INS","business_tag":"alzenins","website":"https://alzenins.com"}` —
one call proves which business and which environment a key belongs to. Worth a
startup assertion so a production key in staging fails loudly.

---

## Correction to the 2026-08-30 spike

That entry documented `capacity`, `lang: "ar"` and `custom_data` from the **create
response**, and `MB-LINK-7CA3D0BDB0` reads back with all three empty. That link
was created by an earlier, simpler request — the doc's JSON was a composite, not
the literal body that produced it. Re-verified today on a fresh link
(`MB-LINK-964178C8A7`): **all three genuinely persist and read back intact.**
The claims stand; the link id attached to them did not.

---

## Still unknown

- [ ] **The event payload itself.** Everything above is registration and
      metadata. No real charge has fired, so the body of a `charge.succeeded`
      is still unseen — and with no transport event id, **the idempotency key
      has to come from that body.** This is now the last blocking unknown.
- [ ] Whether `charge.*` and `payment.*` are aliases or distinct.
- [ ] Refund request body; partial refunds.
- [ ] Whether Mamo retries a failed delivery, and with what backoff.
- [ ] Whether `capacity: 1` genuinely blocks a second payment (needs a real one).

## State left in the sandbox

| Object | Id | Note |
| --- | --- | --- |
| Webhook | `MPB-WH-9830360B11` | Points at staging. `auth_header` is currently the throwaway string `probe-shared-secret-not-real` — **replace with a Secret Manager value before this endpoint grants anything.** |
| Link | `MB-LINK-7CB0B9B242` | 10 AED, `external_id: probe-webhook-payload-0001`, awaiting a sandbox payment to produce the first real event |

Probe links from today were deactivated. Sandbox only; no real money moved.
