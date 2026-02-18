DO $$ BEGIN
 CREATE TYPE "residency_status" AS ENUM('resident', 'non_resident', 'corporate');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "rains_status" AS ENUM('synced', 'attested', 'exempt');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "fefta_status" AS ENUM('not_required', 'review_pending', 'approved', 'submitted');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "payment_method" AS ENUM('cash', 'mortgage');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "romanji_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "katakana_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "nationality" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "residency_status" "residency_status" DEFAULT 'resident';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "domestic_contact_person" jsonb;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "rains_status" "rains_status";--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "designated_zone" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "psychological_defect" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "payment_method" "payment_method" DEFAULT 'mortgage';--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "fefta_status" "fefta_status" DEFAULT 'not_required';