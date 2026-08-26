import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { env, hasGoogleAuth } from "@/env";

/**
 * The edge-safe half of the auth setup: no database adapter, no Node APIs.
 * `src/proxy.ts` imports this so route guards can run in the edge runtime.
 * The full config with the Drizzle adapter lives in ./index.ts.
 */
export const authConfig = {
  secret: env.AUTH_SECRET,
  // JWT rather than database sessions so the edge proxy can read a session
  // without a database round-trip. Privileged routes re-check the role against
  // the database server-side anyway — see ./guards.ts and ADR-0002.
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/ar/sign-in", error: "/ar/sign-in" },
  providers: hasGoogleAuth
    ? [
        Google({
          clientId: env.AUTH_GOOGLE_ID!,
          clientSecret: env.AUTH_GOOGLE_SECRET!,
          allowDangerousEmailAccountLinking: true,
        }),
      ]
    : [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = "role" in user ? user.role : "student";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as typeof session.user.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
