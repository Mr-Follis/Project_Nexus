CREATE EXTENSION IF NOT EXISTS "pgcrypto";--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('region', 'vehicle', 'weapon', 'mission', 'character', 'business', 'property', 'shop', 'collectible', 'achievement', 'activity', 'faction', 'animal', 'patch_note', 'guide', 'other');--> statement-breakpoint
CREATE TYPE "public"."record_status" AS ENUM('draft', 'published', 'hidden', 'archived');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('official', 'direct_gameplay', 'trusted_community', 'user_submission', 'editorial_research', 'third_party_article', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('new', 'needs_more_info', 'duplicate', 'approved', 'rejected', 'spam');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('confirmed_official', 'confirmed_gameplay', 'community_verified', 'likely', 'speculative', 'outdated', 'rejected');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "businesses" (
	"entity_id" uuid PRIMARY KEY NOT NULL,
	"category" text,
	"purchase_price" numeric(12, 2),
	"expected_income" numeric(12, 2),
	"income_interval_minutes" integer,
	"upgrade_costs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"roi_notes" text,
	"risk_level" text,
	"solo_friendly" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collectibles" (
	"entity_id" uuid PRIMARY KEY NOT NULL,
	"collection_name" text,
	"reward" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"total_count" integer,
	"region_count" integer,
	"required_for_100_percent" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"type" "entity_type" NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"summary" text,
	"description" text,
	"status" "record_status" DEFAULT 'draft' NOT NULL,
	"verification" "verification_status" DEFAULT 'speculative' NOT NULL,
	"confidence_score" integer DEFAULT 0 NOT NULL,
	"last_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entities_game_slug_unique" UNIQUE("game_id","slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_aliases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_id" uuid NOT NULL,
	"alias" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_relationships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"from_entity_id" uuid NOT NULL,
	"to_entity_id" uuid NOT NULL,
	"relationship_type" text NOT NULL,
	"confidence_score" integer DEFAULT 0 NOT NULL,
	"verification" "verification_status" DEFAULT 'speculative' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entity_relationship_unique" UNIQUE("from_entity_id","to_entity_id","relationship_type")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_id" uuid NOT NULL,
	"source_id" uuid NOT NULL,
	"claim" text,
	"field_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entity_source_field_unique" UNIQUE("entity_id","source_id","field_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"release_date" date,
	"platforms" text[] DEFAULT '{}' NOT NULL,
	"status" "record_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "games_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guide_entities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guide_id" uuid NOT NULL,
	"entity_id" uuid NOT NULL,
	"relationship_type" text DEFAULT 'related' NOT NULL,
	CONSTRAINT "guide_entity_relationship_unique" UNIQUE("guide_id","entity_id","relationship_type")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"guide_type" text NOT NULL,
	"summary" text,
	"body_md" text,
	"status" "record_status" DEFAULT 'draft' NOT NULL,
	"verification" "verification_status" DEFAULT 'speculative' NOT NULL,
	"seo_title" text,
	"meta_description" text,
	"canonical_url" text,
	"last_verified_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guides_game_slug_unique" UNIQUE("game_id","slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "map_markers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"entity_id" uuid,
	"marker_type" text NOT NULL,
	"title" text NOT NULL,
	"slug" text,
	"description" text,
	"region_entity_id" uuid,
	"x_coordinate" numeric(12, 6),
	"y_coordinate" numeric(12, 6),
	"z_coordinate" numeric(12, 6),
	"latitude" numeric(12, 8),
	"longitude" numeric(12, 8),
	"verification" "verification_status" DEFAULT 'speculative' NOT NULL,
	"confidence_score" integer DEFAULT 0 NOT NULL,
	"status" "record_status" DEFAULT 'draft' NOT NULL,
	"last_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "missions" (
	"entity_id" uuid PRIMARY KEY NOT NULL,
	"character_entity_id" uuid,
	"region_entity_id" uuid,
	"mission_order" integer,
	"spoiler_level" integer DEFAULT 1 NOT NULL,
	"unlock_requirements" text,
	"objectives" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"rewards" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"walkthrough" text,
	"fail_points" text[],
	"recommended_loadout" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" uuid,
	"display_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_auth_user_id_unique" UNIQUE("auth_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "record_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_name" text NOT NULL,
	"record_id" uuid NOT NULL,
	"previous_data" jsonb,
	"new_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"changed_fields" text[] DEFAULT '{}' NOT NULL,
	"changed_by_profile_id" uuid,
	"change_reason" text,
	"source_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid,
	"type" "source_type" NOT NULL,
	"title" text,
	"url" text,
	"author" text,
	"published_at" timestamp with time zone,
	"accessed_at" timestamp with time zone,
	"reliability_score" integer DEFAULT 50 NOT NULL,
	"permission_notes" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"game_id" uuid NOT NULL,
	"submission_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"evidence_url" text,
	"screenshot_url" text,
	"proposed_entity_id" uuid,
	"proposed_marker_id" uuid,
	"ai_summary" text,
	"duplicate_score" numeric(5, 2),
	"status" "submission_status" DEFAULT 'new' NOT NULL,
	"moderator_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	"entity_id" uuid,
	"marker_id" uuid,
	"progress_type" text NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_progress_unique" UNIQUE("user_id","game_id","entity_id","marker_id","progress_type")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicles" (
	"entity_id" uuid PRIMARY KEY NOT NULL,
	"category" text,
	"manufacturer" text,
	"price" numeric(12, 2),
	"top_speed" numeric(8, 2),
	"acceleration" numeric(5, 2),
	"handling" numeric(5, 2),
	"braking" numeric(5, 2),
	"seats" integer,
	"acquisition_methods" text[],
	"unlock_condition" text,
	"customisation_notes" text,
	"best_use_case" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "weapons" (
	"entity_id" uuid PRIMARY KEY NOT NULL,
	"category" text,
	"damage" numeric(5, 2),
	"range_score" numeric(5, 2),
	"fire_rate" numeric(5, 2),
	"accuracy" numeric(5, 2),
	"price" numeric(12, 2),
	"ammo_type" text,
	"unlock_condition" text,
	"attachments" text[],
	"best_use_case" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "businesses" ADD CONSTRAINT "businesses_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collectibles" ADD CONSTRAINT "collectibles_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities" ADD CONSTRAINT "entities_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_aliases" ADD CONSTRAINT "entity_aliases_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_relationships" ADD CONSTRAINT "entity_relationships_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_relationships" ADD CONSTRAINT "entity_relationships_from_entity_id_entities_id_fk" FOREIGN KEY ("from_entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_relationships" ADD CONSTRAINT "entity_relationships_to_entity_id_entities_id_fk" FOREIGN KEY ("to_entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_sources" ADD CONSTRAINT "entity_sources_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity_sources" ADD CONSTRAINT "entity_sources_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guide_entities" ADD CONSTRAINT "guide_entities_guide_id_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guide_entities" ADD CONSTRAINT "guide_entities_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guides" ADD CONSTRAINT "guides_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "map_markers" ADD CONSTRAINT "map_markers_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "map_markers" ADD CONSTRAINT "map_markers_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "map_markers" ADD CONSTRAINT "map_markers_region_entity_id_entities_id_fk" FOREIGN KEY ("region_entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "missions" ADD CONSTRAINT "missions_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "missions" ADD CONSTRAINT "missions_character_entity_id_entities_id_fk" FOREIGN KEY ("character_entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "missions" ADD CONSTRAINT "missions_region_entity_id_entities_id_fk" FOREIGN KEY ("region_entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "record_versions" ADD CONSTRAINT "record_versions_changed_by_profile_id_profiles_id_fk" FOREIGN KEY ("changed_by_profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "record_versions" ADD CONSTRAINT "record_versions_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sources" ADD CONSTRAINT "sources_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_proposed_entity_id_entities_id_fk" FOREIGN KEY ("proposed_entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_proposed_marker_id_map_markers_id_fk" FOREIGN KEY ("proposed_marker_id") REFERENCES "public"."map_markers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_marker_id_map_markers_id_fk" FOREIGN KEY ("marker_id") REFERENCES "public"."map_markers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "weapons" ADD CONSTRAINT "weapons_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_entities_game_type" ON "entities" USING btree ("game_id","type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_entities_status_verification" ON "entities" USING btree ("status","verification");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_relationships_from" ON "entity_relationships" USING btree ("from_entity_id","relationship_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_relationships_to" ON "entity_relationships" USING btree ("to_entity_id","relationship_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_map_markers_game_type" ON "map_markers" USING btree ("game_id","marker_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_map_markers_entity" ON "map_markers" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_map_markers_status" ON "map_markers" USING btree ("status","verification");
