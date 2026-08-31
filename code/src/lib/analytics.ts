import "server-only";
import { PostHog } from "posthog-node";
import { env, hasPostHog } from "@/env";

let client: PostHog | null = null;

/**
 * Server-side analytics. Payment and enrolment events are recorded from the
 * server, never the browser: a client can be closed mid-redirect, blocked by an
 * ad blocker, or lie. Revenue events have to come from the side that knows.
 */
function getClient() {
  if (!hasPostHog) return null;
  client ??= new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return client;
}

export async function trackServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
) {
  const ph = getClient();
  if (!ph) return;
  try {
    ph.capture({ distinctId, event, properties });
    await ph.flush();
  } catch {
    // Analytics must never break a checkout or an enrolment.
  }
}
