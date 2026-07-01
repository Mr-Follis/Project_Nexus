CREATE TYPE "public"."media_provenance" AS ENUM('official_promotional', 'project_nexus_original', 'community_approved', 'placeholder');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('screenshot', 'key_art', 'artwork', 'promotional_image', 'trailer', 'logo', 'other');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"entity_id" uuid,
	"type" "media_type" NOT NULL,
	"provenance" "media_provenance" DEFAULT 'placeholder' NOT NULL,
	"title" text NOT NULL,
	"caption" text,
	"alt_text" text,
	"file_path" text,
	"external_url" text,
	"source_name" text,
	"copyright_owner" text,
	"original_url" text,
	"attribution_required" boolean DEFAULT true NOT NULL,
	"attribution_text" text,
	"width" integer,
	"height" integer,
	"is_featured" boolean DEFAULT false NOT NULL,
	"status" "record_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_media_assets_game_type" ON "media_assets" USING btree ("game_id","type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_media_assets_entity" ON "media_assets" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_media_assets_featured" ON "media_assets" USING btree ("status","is_featured");