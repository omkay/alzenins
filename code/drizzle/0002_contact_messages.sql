CREATE TYPE "public"."contact_message_status" AS ENUM('new', 'read', 'replied', 'spam');--> statement-breakpoint
CREATE TABLE "contact_message" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"channel" text NOT NULL,
	"message" text NOT NULL,
	"locale" "app_locale" DEFAULT 'ar' NOT NULL,
	"status" "contact_message_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
