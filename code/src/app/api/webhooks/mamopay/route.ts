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
 * Headers safe to log with their values. Deliberately narrow: Mamo authenticates
 * a delivery with an `auth_header` shared secret, so anything not on this list
 * gets its name logged and its value withheld.
 */
const INTERESTING = ["content-type", "user-agent", "x-request-id"];

function record(method: string, request: NextRequest, body: string) {
  const headers: Record<string, string> = {};
  const names: string[] = [];

  request.headers.forEach((value, key) => {
    // Every header NAME, because the thing we are hunting for is the name of
    // whatever carries authentication — we cannot allowlist a header we have
    // not seen yet.
    names.push(key);
    // Values only for headers that cannot carry a credential. Mamo's
    // `auth_header` is a shared secret it sends back to us verbatim, and a
    // secret in Cloud Logging is a secret leaked.
    if (INTERESTING.includes(key)) headers[key] = value;
  });

  // One line, so `gcloud logging read` returns it whole.
  console.log(
    "MAMO_WEBHOOK_PROBE " +
      JSON.stringify({
        method,
        url: request.nextUrl.pathname + request.nextUrl.search,
        headerNames: names.sort(),
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
