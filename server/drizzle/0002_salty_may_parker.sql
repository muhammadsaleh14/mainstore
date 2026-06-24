CREATE TYPE "public"."product_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"parent_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"sku" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"compare_at_price" numeric(10, 2),
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"barcode" text,
	"weight_grams" integer,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_variants_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "status" "product_status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "category_id" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_slug_unique" UNIQUE("slug");