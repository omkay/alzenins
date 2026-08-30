// Match Next's precedence: .env.local wins over .env. `neon link` writes the
// linked branch's DATABASE_URL into .env, so without this, drizzle-kit and the
// seed would silently target the Neon branch instead of local Docker.
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  casing: "snake_case",
  strict: true,
  verbose: true,
});
