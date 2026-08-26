import { sql } from "drizzle-orm";
import { db } from "@/server/db";

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Atomic fixed-window counter. The whole read-modify-write happens in one
 * statement so two simultaneous requests can't both see a stale count — the
 * same reason seat allocation takes a row lock (docs/data-model.md §3).
 */
export async function consume(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const rows = await db.execute<{ count: number; window_start: Date }>(sql`
    INSERT INTO rate_limit (key, count, window_start)
    VALUES (${key}, 1, now())
    ON CONFLICT (key) DO UPDATE SET
      count = CASE
        WHEN rate_limit.window_start < now() - make_interval(secs => ${windowSeconds})
        THEN 1 ELSE rate_limit.count + 1 END,
      window_start = CASE
        WHEN rate_limit.window_start < now() - make_interval(secs => ${windowSeconds})
        THEN now() ELSE rate_limit.window_start END
    RETURNING count, window_start
  `);

  const row = rows[0];
  if (!row) return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };

  const elapsed = (Date.now() - new Date(row.window_start).getTime()) / 1000;
  const retryAfterSeconds = Math.max(1, Math.ceil(windowSeconds - elapsed));

  return {
    ok: row.count <= limit,
    remaining: Math.max(0, limit - row.count),
    retryAfterSeconds,
  };
}

/**
 * Best-effort client address. Behind Vercel this is the real client; behind an
 * unknown proxy it can be spoofed, which is why every limit below is paired
 * with a second one keyed on something the caller cannot choose freely.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function tooManyRequests(retryAfterSeconds: number) {
  return new Response(
    JSON.stringify({ error: "rate_limited", retryAfterSeconds }),
    {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": String(retryAfterSeconds),
      },
    },
  );
}
