ALTER TABLE "products" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'disabled';--> statement-breakpoint
UPDATE "products" SET "status" = CASE
  WHEN "status" = 'active' THEN 'enabled'
  ELSE 'disabled'
END;--> statement-breakpoint
DROP TYPE "public"."product_status";--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('enabled', 'disabled');--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'disabled'::"public"."product_status";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DATA TYPE "public"."product_status" USING "status"::"public"."product_status";
