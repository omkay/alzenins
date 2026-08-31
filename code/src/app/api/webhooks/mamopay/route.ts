import type { NextRequest } from "next/server";

/**
 * MamoPay webhook receiver — **probe mode**.
 *
 * This route exists before the adapter does, on purpose. AGENTS.md §3.6 says
 * don't guess integration behaviour, and the whole Phase 2 idempotency design
 * rests on a stable event id we have never actually seen. So the first version
 * of this endpoint only records what arrives.
 *
 * Two things forced it to be a real, deployed route rather than a local script:
 *
 *  1. `POST /webhooks` on Mamo's side **validates reachability at registration
 *     time** — it answers `"Webhook is unreachable"` for anything it cannot
 *     call. There is no way to register a localhost tunnel-free endpoint.
 *  2. The signature header name and algorithm are undocumented for us. The only
 *     way to learn them is to read a delivery we received.
 *
 * It answers 200 to everything, including the reachability probe, and never
 * throws — a webhook endpoint that 500s gets retried, and during a spike that
 * would bury the signal in duplicates.
 *
 * **This is not the production shape.** Before any entitlement is granted from a
 * webhook, this route must verify the signature and reject anything unsigned.
 * Until then it grants nothing; it is write-only to the log.
 */

// Signature verification will need the exact bytes, so never let a framework
// body parser near this route.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Headers worth reading back. Everything else on a webhook delivery is transport
 * noise, and an allowlist keeps us from logging a cookie or an auth header if
 * one ever shows up.
 */
const INTERESTING = [
  "content-type",
  "user-agent",
  "x-mamo-signature",
  "x-mamopay-signature",
  "x-signature",
  "mamo-signature",
  "x-request-id",
  "x-webhook-id",
  "x-idempotency-key",
];

function record(method: string, request: NextRequest, body: string) {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    // Log the allowlist by name, plus anything that looks like a signature or an
    // event id we did not anticipate — that is the whole point of the probe.
    if (INTERESTING.includes(key) || /sign|event|delivery|attempt/i.test(key)) {
      headers[key] = value;
    }
  });

  // One line, so `gcloud logging read` returns it whole.
  console.log(
    "MAMO_WEBHOOK_PROBE " +
      JSON.stringify({
        method,
        url: request.nextUrl.pathname + request.nextUrl.search,
        headers,
        bodyLength: body.length,
        body: body.slice(0, 8000),
      }),
  );
}

export async function POST(request: NextRequest) {
  let body = "";
  try {
    body = await request.text();
  } catch {
    // A body we cannot read is itself worth knowing about.
  }
  record("POST", request, body);
  return Response.json({ received: true }, { status: 200 });
}

/** Mamo's reachability check may be a GET; answer it rather than 405. */
export async function GET(request: NextRequest) {
  record("GET", request, "");
  return Response.json({ received: true }, { status: 200 });
}

export async function HEAD(request: NextRequest) {
  record("HEAD", request, "");
  return new Response(null, { status: 200 });
}
