import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { appLocale, id } from "./identity";

/**
 * Fixed-window rate limiting, in Postgres rather than Redis.
 *
 * Auth traffic is low volume and we already have a database; adding a second
 * datastore for a handful of counters is not worth the operational surface.
 * Revisit if we ever need to limit something high-frequency.
 */
export const rateLimits = pgTable("rate_limit", {
  key: text().primaryKey(),
  count: integer().notNull().default(0),
  windowStart: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const contactMessageStatus = pgEnum("contact_message_status", [
  "new",
  "read",
  "replied",
  "spam",
]);

/**
 * The contact form on the marketing site. Kept in our own database rather than
 * emailed straight out so nothing is lost if mail delivery fails, and so the
 * admin dashboard (Phase 8) has an inbox to render.
 */
export const contactMessages = pgTable("contact_message", {
  id: id(),
  name: text().notNull(),
  /** Email address or WhatsApp number — the form accepts either. */
  channel: text().notNull(),
  message: text().notNull(),
  locale: appLocale().notNull().default("ar"),
  status: contactMessageStatus().notNull().default("new"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
