DO $$ BEGIN
 CREATE TYPE "communication_preference" AS ENUM('detailed', 'concise');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "ekyc_status" AS ENUM('not_started', 'pending', 'verified', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "language_preference" AS ENUM('ja', 'en');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('buyer', 'partner_agent', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "building_type" AS ENUM('mansion', 'apartment', 'kodate', 'land');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "earthquake_standard" AS ENUM('old', 'new', 'grade1', 'grade2', 'grade3', 'unknown');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "source" AS ENUM('suumo', 'homes', 'athome', 'reins', 'partner_direct', 'yahoo_re');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "structure" AS ENUM('rc', 'src', 'steel', 'wood', 'light_steel', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "risk_level" AS ENUM('none', 'low', 'moderate', 'high', 'very_high');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "journey_status" AS ENUM('active', 'completed', 'paused');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "shortlist_state" AS ENUM('shortlisted', 'viewing_scheduled', 'viewed', 'offering', 'negotiating', 'contract_prep', 'contract_signed', 'settlement_prep', 'settled', 'dropped', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "mortgage_status" AS ENUM('not_started', 'preapproval_submitted', 'preapproved', 'formal_submitted', 'approved', 'declined', 'not_needed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "transaction_status" AS ENUM('active', 'completed', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "analysis_status" AS ENUM('pending', 'processing', 'completed', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "document_type" AS ENUM('registry_transcript', 'important_matter_explanation', 'sale_contract', 'building_inspection', 'management_rules', 'mortgage_application', 'offer_letter', 'identity_document', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "review_status" AS ENUM('draft', 'pending_review', 'reviewed', 'approved');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "channel" AS ENUM('web', 'mobile', 'line', 'voice');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "message_role" AS ENUM('user', 'assistant', 'system', 'tool');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "execution_status" AS ENUM('pending_approval', 'executing', 'completed', 'failed', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "permission_level" AS ENUM('autonomous', 'user_approval', 'professional_required');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"phone" text,
	"language_preference" "language_preference" DEFAULT 'ja',
	"line_user_id" text,
	"financial_profile" jsonb,
	"ekyc_status" "ekyc_status" DEFAULT 'not_started',
	"ekyc_verified_at" timestamp with time zone,
	"role" "role" DEFAULT 'buyer',
	"communication_preference" "communication_preference" DEFAULT 'detailed',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_line_user_id_unique" UNIQUE("line_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" "source",
	"source_listing_id" text,
	"address" text NOT NULL,
	"prefecture" text,
	"municipality" text,
	"district" text,
	"location" geography(Point, 4326),
	"building_type" "building_type",
	"structure" "structure",
	"total_area_sqm" numeric(10, 2),
	"land_area_sqm" numeric(10, 2),
	"floor_plan" text,
	"num_rooms" integer,
	"floor_level" integer,
	"total_floors" integer,
	"total_units" integer,
	"year_built" integer,
	"year_renovated" integer,
	"earthquake_standard" "earthquake_standard",
	"listing_price" bigint,
	"management_fee" integer,
	"repair_reserve_fee" integer,
	"ground_lease_fee" integer,
	"nearest_station_name" text,
	"nearest_station_line" text,
	"nearest_station_walk_minutes" integer,
	"zoning" text,
	"building_coverage_ratio" numeric(5, 2),
	"floor_area_ratio" numeric(5, 2),
	"features" jsonb,
	"images" jsonb,
	"floor_plan_image_url" text,
	"listing_url" text,
	"description" text,
	"listing_date" date,
	"is_active" boolean DEFAULT true,
	"last_scraped_at" timestamp with time zone,
	"embedding" vector(1024),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "properties_source_source_listing_id_unique" UNIQUE("source","source_listing_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "property_price_predictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"model_version" text,
	"predicted_price" bigint,
	"confidence_lower" bigint,
	"confidence_upper" bigint,
	"mape_at_prediction_time" numeric(5, 2),
	"top_positive_factors" jsonb,
	"top_negative_factors" jsonb,
	"explanation_text_ja" text,
	"explanation_text_en" text,
	"predicted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "property_hazard_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"flood_risk" "risk_level",
	"landslide_risk" "risk_level",
	"tsunami_risk" "risk_level",
	"liquefaction_risk" "risk_level",
	"source_url" text,
	"fetched_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journeys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"search_criteria" jsonb,
	"status" "journey_status" DEFAULT 'active',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "journeys_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shortlisted_properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journey_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"user_notes" text,
	"user_rating" integer,
	"state" "shortlist_state" DEFAULT 'shortlisted',
	"state_changed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shortlisted_properties_journey_id_property_id_unique" UNIQUE("journey_id","property_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shortlisted_property_id" uuid NOT NULL,
	"journey_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"offer_price" bigint,
	"agreed_price" bigint,
	"earnest_money" bigint,
	"settlement_date" date,
	"mortgage_status" "mortgage_status" DEFAULT 'not_started',
	"mortgage_institution" text,
	"mortgage_amount" bigint,
	"assigned_agent_id" uuid,
	"assigned_scrivener" text,
	"status" "transaction_status" DEFAULT 'active',
	"cancellation_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_shortlisted_property_id_unique" UNIQUE("shortlisted_property_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" uuid,
	"user_id" uuid NOT NULL,
	"property_id" uuid,
	"document_type" "document_type" NOT NULL,
	"file_path" text NOT NULL,
	"file_name" text NOT NULL,
	"mime_type" text,
	"analysis_status" "analysis_status" DEFAULT 'pending',
	"analysis_result" jsonb,
	"risk_flags" jsonb,
	"review_status" "review_status" DEFAULT 'draft',
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"channel" "channel" NOT NULL,
	"langgraph_thread_id" text,
	"is_active" boolean DEFAULT true,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_message_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" "message_role" NOT NULL,
	"content" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "action_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"transaction_id" uuid,
	"action_name" text NOT NULL,
	"action_inputs" jsonb,
	"action_outputs" jsonb,
	"permission_level" "permission_level" NOT NULL,
	"approval_record" jsonb,
	"execution_status" "execution_status" DEFAULT 'pending_approval',
	"error_detail" text,
	"executed_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_properties_pref_muni_price" ON "properties" ("prefecture","municipality","listing_price");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_properties_walk_minutes" ON "properties" ("nearest_station_walk_minutes");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_properties_is_active" ON "properties" ("is_active");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "property_price_predictions" ADD CONSTRAINT "property_price_predictions_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "property_hazard_data" ADD CONSTRAINT "property_hazard_data_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "journeys" ADD CONSTRAINT "journeys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shortlisted_properties" ADD CONSTRAINT "shortlisted_properties_journey_id_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "journeys"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shortlisted_properties" ADD CONSTRAINT "shortlisted_properties_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_shortlisted_property_id_shortlisted_properties_id_fk" FOREIGN KEY ("shortlisted_property_id") REFERENCES "shortlisted_properties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_journey_id_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "journeys"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_assigned_agent_id_users_id_fk" FOREIGN KEY ("assigned_agent_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
