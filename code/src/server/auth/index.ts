import NextAuth from "next-auth";
import type { EmailConfig } from "next-auth/providers";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { env } from "@/env";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { authConfig } from "./config";
import { generateOtp, sendOtpEmail } from "./otp";

/**
 * Email one-time-code provider. Auth.js's built-in email flow is a magic link;
 * we override token generation and delivery to send a six-digit code instead,
 * and the sign-in form posts it back to the standard callback URL.
 */
const emailOtp: EmailConfig = {
  id: "email-otp",
  name: "Email",
  type: "email",
  from: env.EMAIL_FROM,
  maxAge: 10 * 60,
  server: undefined,
  options: {},
  generateVerificationToken: async () => generateOtp(),
  sendVerificationRequest: async ({ identifier, token }) => {
    await sendOtpEmail(identifier, token);
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [...authConfig.providers, emailOtp],
});
