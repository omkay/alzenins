import postgres from "postgres";

/**
 * Clears the rate-limit counters before a run.
 *
 * The suite signs in several times from one address, and repeated runs would
 * otherwise exhaust the real 8-codes-per-IP budget and fail for the wrong
 * reason. Resetting the counters keeps production limits untouched while
 * leaving the limiter itself in the path being tested.
 */
export default async function globalSetup() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required to run the E2E suite");

  const sql = postgres(url, { max: 1 });
  try {
    await sql`DELETE FROM rate_limit`;
  } finally {
    await sql.end({ timeout: 5 });
  }
}
