"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { PostHog } from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

/**
 * Product analytics, off entirely without a key.
 *
 * posthog-js is imported dynamically so it never enters the main bundle — it is
 * ~50KB that the marketing pages, our most performance-sensitive surface, would
 * otherwise pay for on first paint whether or not analytics is configured.
 *
 * Deliberately conservative: no session recording and no autocapture. This app
 * has sign-in code fields and will have payment pages; recording what students
 * type is a liability. We would rather name the handful of events that matter
 * than sweep up everything and filter later.
 */
export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const client = useRef<PostHog | null>(null);

  useEffect(() => {
    if (!KEY) return;
    let cancelled = false;

    void import("posthog-js").then(({ default: posthog }) => {
      if (cancelled) return;
      if (!posthog.__loaded) {
        posthog.init(KEY, {
          api_host: HOST,
          capture_pageview: false,
          capture_pageleave: true,
          autocapture: false,
          disable_session_recording: true,
          person_profiles: "identified_only",
        });
      }
      client.current = posthog;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const posthog = client.current;
    if (!posthog) return;
    const query = searchParams.toString();
    posthog.capture("$pageview", {
      $current_url: `${window.location.origin}${pathname}${query ? `?${query}` : ""}`,
    });
  }, [pathname, searchParams]);

  return null;
}
