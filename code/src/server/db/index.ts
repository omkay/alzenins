import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";
import * as schema from "./schema";

declare global {
  var __alzeninsSql: ReturnType<typeof postgres> | undefined;
}

// One pool per process. In dev, Next's module reloading would otherwise open a
// new pool on every edit until Postgres refuses connections.
const client =
  globalThis.__alzeninsSql ??
  postgres(env.DATABASE_URL, { max: env.NODE_ENV === "production" ? 10 : 3 });

if (env.NODE_ENV !== "production") globalThis.__alzeninsSql = client;

export const db = drizzle(client, { schema, casing: "snake_case" });
export { schema };
