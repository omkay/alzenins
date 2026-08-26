# Phase 7 — Store (digital only)

**Goal:** a curated shop for digital goods — material packs, worksheet bundles, audio,
flashcard decks — bought once and delivered instantly through the entitlement engine.

**Estimate:** 1–2 weeks · **Depends on:** Phases 2 and 4 · **Status:** `Not started`

> **Scope decision, 2026-08-27: digital only.** No physical goods. That removes shipping
> zones and rates, carrier integration, customs, stock levels, oversell protection, packing
> slips, returns and address collection — roughly half the original phase. If physical goods
> are ever added, that is a new phase, not an extension of this one.

## In scope

### Catalogue
- `store_item` on top of the shared `product` / `price` tables, always `is_digital = true`
- Bilingual titles, descriptions, media gallery, categories and tags
- Level tagging (N5–N1) so items can be surfaced from the matching course
- Full admin CRUD: create, edit, duplicate, archive, bulk price update
- Bundles: several digital items sold as one product at a combined price

### Delivery — this is the whole mechanism
- A purchase grants an **entitlement**, exactly like a recorded course
  ([ADR-0004](../decisions/ADR-0004-entitlements-as-access-authority.md)). There is no
  separate "download" concept to build.
- Files live in R2; every download is a **short-lived signed URL** generated per request
  after an entitlement check ([ADR-0006](../decisions/ADR-0006-video-hosting-and-gated-access.md))
- Per-user download counters, to spot a shared link being hammered
- PDFs watermarked with the buyer's email — traceable, not DRM
- A permanent "My materials" library: everything the student has ever bought or been granted

### Cart & checkout
- Persistent cart, mixed line types — a cohort seat and a worksheet pack in one basket
- Guest checkout, with account creation offered after purchase
- **No address collection, ever.** A digital basket never asks where you live.
- VAT per [ADR-0007](../decisions/ADR-0007-vat-treatment.md): UAE 5%, tax-inclusive

### Discounts
- Percent and fixed, per-currency fixed amounts
- Targeting by product, category, first order, or customer segment
- Auto-applied promotions: active subscribers get a standing discount on materials —
  an entitlement check, not a coupon code
- Stacking rules, minimum order, redemption caps, per-customer limits

### Refunds
- Admin-issued refunds revoke the entitlement, which immediately stops new signed URLs
- Refund window policy stated on the product page and enforced in code

## Out of scope

Physical goods in any form. Multi-warehouse, dropship, marketplace sellers, subscription
boxes. Print-on-demand.

## Acceptance criteria

- [ ] An admin creates a digital product with a PDF and an audio file, and it appears live
- [ ] A purchase grants access within seconds and the file downloads
- [ ] A signed download URL copied and reused an hour later is rejected
- [ ] Revoking the entitlement stops new download URLs being issued — verified by direct
      API call, not just a hidden button
- [ ] A cart with a course seat and two digital items checks out as one payment and fulfils both
- [ ] A digital-only basket never asks for a shipping address
- [ ] An active subscriber sees the standing materials discount applied automatically
- [ ] A refund revokes access and the download stops working
- [ ] Downloaded PDFs carry the buyer's email as a watermark
- [ ] The full store flow works in Arabic RTL on a phone

## Sign-off checklist

- [ ] All acceptance criteria demonstrated on staging
- [ ] Real catalogue loaded with actual materials from the instructors
- [ ] Refund policy published and matching what the code does
- [ ] Runbook: replace a file, re-grant access, handle a refund

## Sign-off

| Field | Value |
| --- | --- |
| Owner | |
| Date | |
| Carve-outs | |
