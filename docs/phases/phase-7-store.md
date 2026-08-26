# Phase 7 — Store

**Goal:** a real curated shop — catalogue, stock, variants, discounts, shipping across the
target countries, and order fulfilment an admin can actually run.

**Estimate:** 2–3 weeks · **Depends on:** Phase 2 · **Status:** `Not started`

Scope depends heavily on the Phase 0 answer to "physical or digital?". Physical goods
shipping to 16 countries is the larger half of this phase.

## In scope

### Catalogue
- `store_item` / `variant` on top of the shared `product` / `price` tables
- Variants (size, colour, language edition) with per-variant SKU, stock, and price delta
- Product media gallery, rich bilingual descriptions, categories and tags
- Related products and "students also bought" (simple co-purchase query, not ML)
- Full admin CRUD: create, edit, duplicate, archive, bulk price update, CSV import/export

### Inventory
- `stock_movement` append-only ledger; on-hand and reserved tracked separately
- Reservation on order creation, released on expiry or cancellation, committed on fulfilment
- Low-stock threshold with admin alerts; back-order and pre-order flags
- Oversell protection with the same transactional lock pattern as seats

### Cart & checkout
- Persistent cart (server-side for signed-in users, cookie for guests), mixed line types —
  a cohort seat and a textbook in one order is a legitimate basket
- Guest checkout with account creation offered post-purchase
- Address collection only when the basket requires shipping
- Shipping zones mapped to the same country list as pricing, rate tables per currency
- Tax/VAT applied per the Phase 0 determination

### Discounts (full)
- Percent, fixed, free-shipping, and buy-X-get-Y
- Targeting by product, category, first order, or customer segment
- Stacking rules, minimum order, redemption caps, per-customer limits
- Auto-applied promotions alongside code entry

### Fulfilment
- Order pipeline: paid → processing → packed → shipped → delivered, with per-state notifications
- Tracking number capture and a customer-facing order status page
- Returns and partial refunds with correct stock and entitlement handling
- Packing slips and a daily orders export

## Out of scope

Multi-warehouse. Dropship integrations. Marketplace sellers. Subscription boxes.

## Acceptance criteria

- [ ] An admin creates a product with three variants and different stock per variant
- [ ] Buying the last unit of a variant marks it sold out; two simultaneous buyers → one succeeds
- [ ] A cart with a course seat and two books checks out as one payment and fulfils both correctly
- [ ] Shipping to Saudi Arabia and to Japan each quote the right rate in the right currency
- [ ] A discount code respects its cap and refuses a stacked second code per the rules
- [ ] Cancelling an unpaid order releases reserved stock within the expiry window
- [ ] A partial refund returns the right stock and leaves the rest of the order intact
- [ ] Digital-only baskets never ask for a shipping address
- [ ] The full store flow works in Arabic RTL on a phone

## Sign-off checklist

- [ ] All acceptance criteria demonstrated on staging
- [ ] Real catalogue loaded with actual products and photography
- [ ] Shipping rates verified against real carrier quotes for at least 5 countries
- [ ] Runbook: cancel and refund an order, fix stock drift, handle a return

## Sign-off

| Field | Value |
| --- | --- |
| Owner | |
| Date | |
| Carve-outs | |
