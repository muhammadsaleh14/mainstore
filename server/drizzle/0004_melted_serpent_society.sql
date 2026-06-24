CREATE TYPE "public"."role" AS ENUM('admin', 'manager', 'customer');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'customer' NOT NULL;