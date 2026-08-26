import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { ulid } from "ulid";

export const id = () =>
  text()
    .primaryKey()
    .$defaultFn(() => ulid());

export const userRole = pgEnum("user_role", [
  "student",
  "teacher",
  "admin",
  "owner",
]);

export const userStatus = pgEnum("user_status", [
  "active",
  "suspended",
  "deleted",
]);

export const appLocale = pgEnum("app_locale", ["ar", "en"]);

export const users = pgTable(
  "user",
  {
    id: id(),
    email: text().notNull(),
    emailVerifiedAt: timestamp({ withTimezone: true }),
    name: text(),
    image: text(),
    locale: appLocale().notNull().default("ar"),
    /** ISO-3166-1 alpha-2. Drives display currency — see ADR-0003. */
    country: text(),
    /** IANA zone. Every time in the product renders through this. */
    timezone: text().notNull().default("Asia/Dubai"),
    phoneE164: text(),
    role: userRole().notNull().default("student"),
    status: userStatus().notNull().default("active"),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Emails are case-insensitive in practice; normalise on write and enforce here.
    uniqueIndex("user_email_unique").on(t.email),
    index("user_role_idx").on(t.role),
  ],
);

/** Auth.js adapter tables. The user row above stays ours. */
export const accounts = pgTable(
  "account",
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text().notNull(),
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    refreshToken: text(),
    accessToken: text(),
    expiresAt: integer(),
    tokenType: text(),
    scope: text(),
    idToken: text(),
    sessionState: text(),
  },
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_idx").on(t.userId),
  ],
);

export const sessions = pgTable(
  "session",
  {
    sessionToken: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp({ withTimezone: true }).notNull(),
  },
  (t) => [index("session_user_idx").on(t.userId)],
);

export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: timestamp({ withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const teacherProfiles = pgTable("teacher_profile", {
  userId: text()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  headlineAr: text(),
  headlineEn: text(),
  bioAr: text(),
  bioEn: text(),
  /** ISO-639-1 codes the teacher can teach in. */
  languages: text().array().notNull().default([]),
  isNativeSpeaker: boolean().notNull().default(false),
  isBookable: boolean().notNull().default(false),
  /** Credits a single 1:1 session costs. Phase 5. */
  sessionCreditCost: integer().notNull().default(1),
  bookingLeadTimeMinutes: integer().notNull().default(720),
  bufferMinutes: integer().notNull().default(15),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type TeacherProfile = typeof teacherProfiles.$inferSelect;
