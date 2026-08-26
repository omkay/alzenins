# ADR-0007 — UAE VAT applied as standard-rated, provisionally

| Field | Value |
| --- | --- |
| Status | **Accepted (provisional)** |
| Date | 2026-08-27 |
| Deciders | Owner, engineering |

## Context

The business is UAE-registered and settles in AED. Tax treatment changes the shape of the
price model — tax-inclusive versus tax-added — and is painful to retrofit once a price book
exists across sixteen markets and orders have been written with a stored tax amount.

UAE VAT on education is not a single answer. Some educational services supplied by
recognised institutions are zero-rated or exempt; commercial language training generally is
not. The distinction turns on the provider's registration status and the nature of the
course, which is an accountant's determination, not an engineering one.

The owner has asked to proceed on the UAE default rather than block Phase 2 on it.

## Decision

Apply **UAE VAT at the standard 5%**, treated as **tax-inclusive** on displayed prices.

- Displayed prices are what the customer pays. No tax is added at checkout.
- Every order stores `tax_minor`, `tax_rate` and `tax_treatment` as its own columns, so the
  tax component is recoverable per order even though it is not shown as a separate line.
- Tax configuration is a setting, not a constant, so changing the rate or the treatment does
  not require a migration or a code change.
- Non-UAE markets are treated as out of scope for UAE VAT at this stage.

## Consequences

- Phase 2 is unblocked and prices read as clean round numbers, which suits the market.
- **This is provisional.** It must be confirmed in writing by the accountant before launch —
  the check belongs in Phase 9's sign-off. If the correct treatment turns out to be
  zero-rated or exempt, the stored per-order tax component makes the correction
  straightforward; if it turns out that VAT should have been *added* rather than included,
  margin has been quietly absorbed on every order sold in the meantime.
- Storing rate and treatment per order rather than deriving them at report time means
  historical orders stay correct after a rate change.
- Out of scope: reverse-charge handling, EU VAT/OSS, and US sales tax. If international
  revenue becomes material, that is its own ADR.
