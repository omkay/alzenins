# ADR-0006 — Managed video hosting with signed playback for recorded courses

| Field | Value |
| --- | --- |
| Status | Proposed |
| Date | 2026-08-26 |
| Deciders | Owner, engineering |

## Context

Recorded courses are sold either as a one-off unlock or bundled into a subscription. Access
must be **revocable** — when a subscription lapses, playback must stop, not merely become
harder to find. Students are on mobile connections across MENA, so adaptive bitrate is a
requirement rather than a nicety. Arabic and English captions are mandatory for a language
school.

Self-hosting (raw MP4 in R2 behind signed URLs) is cheap but gives no transcoding, no ABR,
no per-view analytics, and a URL that once signed can be shared for its full TTL.

## Decision

Use a **managed video platform behind a `VideoProvider` port** — Mux as the default,
Cloudflare Stream as the cost-optimised alternative. Both offer signed playback tokens,
adaptive bitrate, caption tracks, and per-view analytics.

Access rules:

1. The player never receives a permanent URL. It requests a **short-lived signed playback
   token** from our server on load and on resume.
2. Token issuance runs `hasEntitlement()` ([ADR-0004](ADR-0004-entitlements-as-access-authority.md))
   server-side. A revoked entitlement stops the next token within the TTL.
3. Non-video materials (PDFs, audio) live in R2 and are served through short-lived signed
   URLs generated per request. No public bucket paths.
4. The player is watermarked with the student's email. Determined piracy is not preventable
   at this budget; we make casual sharing traceable and stop there.

Choose Mux vs Cloudflare Stream in Phase 0 on modelled cost per student-hour. Because the
port exists, this is a swap, not a rewrite.

## Consequences

- Video is likely the largest recurring infrastructure cost. Model it before committing.
- Revocation is genuinely enforceable, which is what makes subscription-gated content a real
  product rather than an honour system.
- Token issuance adds a server round-trip on player load — negligible against video startup.
- Uploading is an admin workflow with transcoding latency; the content manager must show
  processing state rather than a broken player.
