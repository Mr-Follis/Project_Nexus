import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid
} from "drizzle-orm/pg-core";

export const recordStatus = pgEnum("record_status", [
  "draft",
  "published",
  "hidden",
  "archived"
]);

export const verificationStatus = pgEnum("verification_status", [
  "confirmed_official",
  "confirmed_gameplay",
  "community_verified",
  "likely",
  "speculative",
  "outdated",
  "rejected"
]);

export const sourceType = pgEnum("source_type", [
  "official",
  "direct_gameplay",
  "trusted_community",
  "user_submission",
  "editorial_research",
  "third_party_article",
  "unknown"
]);

export const entityType = pgEnum("entity_type", [
  "region",
  "vehicle",
  "weapon",
  "mission",
  "character",
  "business",
  "property",
  "shop",
  "collectible",
  "achievement",
  "activity",
  "faction",
  "animal",
  "patch_note",
  "guide",
  "other"
]);

export const submissionStatus = pgEnum("submission_status", [
  "new",
  "needs_more_info",
  "duplicate",
  "approved",
  "rejected",
  "spam"
]);

export const mediaType = pgEnum("media_type", [
  "screenshot",
  "key_art",
  "artwork",
  "promotional_image",
  "trailer",
  "logo",
  "other"
]);

// Tracks where an asset came from so official promotional placeholders can be
// gradually replaced by original Project Nexus or community-approved media.
export const mediaProvenance = pgEnum("media_provenance", [
  "official_promotional",
  "project_nexus_original",
  "community_approved",
  "placeholder"
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
};

export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  releaseDate: date("release_date"),
  platforms: text("platforms").array().notNull().default([]),
  status: recordStatus("status").notNull().default("draft"),
  ...timestamps
});

export const entities = pgTable(
  "entities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    type: entityType("type").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    summary: text("summary"),
    description: text("description"),
    status: recordStatus("status").notNull().default("draft"),
    verification: verificationStatus("verification")
      .notNull()
      .default("speculative"),
    confidenceScore: integer("confidence_score").notNull().default(0),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    ...timestamps
  },
  (table) => ({
    gameSlugUnique: unique("entities_game_slug_unique").on(
      table.gameId,
      table.slug
    ),
    gameTypeIdx: index("idx_entities_game_type").on(table.gameId, table.type),
    statusVerificationIdx: index("idx_entities_status_verification").on(
      table.status,
      table.verification
    )
  })
);

export const entityAliases = pgTable("entity_aliases", {
  id: uuid("id").primaryKey().defaultRandom(),
  entityId: uuid("entity_id")
    .notNull()
    .references(() => entities.id, { onDelete: "cascade" }),
  alias: text("alias").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow()
});

export const entityRelationships = pgTable(
  "entity_relationships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    fromEntityId: uuid("from_entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    toEntityId: uuid("to_entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    relationshipType: text("relationship_type").notNull(),
    confidenceScore: integer("confidence_score").notNull().default(0),
    verification: verificationStatus("verification")
      .notNull()
      .default("speculative"),
    notes: text("notes"),
    ...timestamps
  },
  (table) => ({
    relationshipUnique: unique("entity_relationship_unique").on(
      table.fromEntityId,
      table.toEntityId,
      table.relationshipType
    ),
    fromIdx: index("idx_relationships_from").on(
      table.fromEntityId,
      table.relationshipType
    ),
    toIdx: index("idx_relationships_to").on(
      table.toEntityId,
      table.relationshipType
    )
  })
);

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id").references(() => games.id, { onDelete: "cascade" }),
  type: sourceType("type").notNull(),
  title: text("title"),
  url: text("url"),
  author: text("author"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  accessedAt: timestamp("accessed_at", { withTimezone: true }),
  reliabilityScore: integer("reliability_score").notNull().default(50),
  permissionNotes: text("permission_notes"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow()
});

export const entitySources = pgTable(
  "entity_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entityId: uuid("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
    claim: text("claim"),
    fieldName: text("field_name"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => ({
    entitySourceUnique: unique("entity_source_field_unique").on(
      table.entityId,
      table.sourceId,
      table.fieldName
    )
  })
);

export const vehicles = pgTable("vehicles", {
  entityId: uuid("entity_id")
    .primaryKey()
    .references(() => entities.id, { onDelete: "cascade" }),
  category: text("category"),
  manufacturer: text("manufacturer"),
  price: numeric("price", { precision: 12, scale: 2 }),
  topSpeed: numeric("top_speed", { precision: 8, scale: 2 }),
  acceleration: numeric("acceleration", { precision: 5, scale: 2 }),
  handling: numeric("handling", { precision: 5, scale: 2 }),
  braking: numeric("braking", { precision: 5, scale: 2 }),
  seats: integer("seats"),
  acquisitionMethods: text("acquisition_methods").array(),
  unlockCondition: text("unlock_condition"),
  customisationNotes: text("customisation_notes"),
  bestUseCase: text("best_use_case")
});

export const weapons = pgTable("weapons", {
  entityId: uuid("entity_id")
    .primaryKey()
    .references(() => entities.id, { onDelete: "cascade" }),
  category: text("category"),
  damage: numeric("damage", { precision: 5, scale: 2 }),
  rangeScore: numeric("range_score", { precision: 5, scale: 2 }),
  fireRate: numeric("fire_rate", { precision: 5, scale: 2 }),
  accuracy: numeric("accuracy", { precision: 5, scale: 2 }),
  price: numeric("price", { precision: 12, scale: 2 }),
  ammoType: text("ammo_type"),
  unlockCondition: text("unlock_condition"),
  attachments: text("attachments").array(),
  bestUseCase: text("best_use_case")
});

export const missions = pgTable("missions", {
  entityId: uuid("entity_id")
    .primaryKey()
    .references(() => entities.id, { onDelete: "cascade" }),
  characterEntityId: uuid("character_entity_id").references(() => entities.id),
  regionEntityId: uuid("region_entity_id").references(() => entities.id),
  missionOrder: integer("mission_order"),
  spoilerLevel: integer("spoiler_level").notNull().default(1),
  unlockRequirements: text("unlock_requirements"),
  objectives: jsonb("objectives").notNull().default([]),
  rewards: jsonb("rewards").notNull().default({}),
  walkthrough: text("walkthrough"),
  failPoints: text("fail_points").array(),
  recommendedLoadout: text("recommended_loadout")
});

export const businesses = pgTable("businesses", {
  entityId: uuid("entity_id")
    .primaryKey()
    .references(() => entities.id, { onDelete: "cascade" }),
  category: text("category"),
  purchasePrice: numeric("purchase_price", { precision: 12, scale: 2 }),
  expectedIncome: numeric("expected_income", { precision: 12, scale: 2 }),
  incomeIntervalMinutes: integer("income_interval_minutes"),
  upgradeCosts: jsonb("upgrade_costs").notNull().default({}),
  roiNotes: text("roi_notes"),
  riskLevel: text("risk_level"),
  soloFriendly: boolean("solo_friendly")
});

export const collectibles = pgTable("collectibles", {
  entityId: uuid("entity_id")
    .primaryKey()
    .references(() => entities.id, { onDelete: "cascade" }),
  collectionName: text("collection_name"),
  reward: jsonb("reward").notNull().default({}),
  totalCount: integer("total_count"),
  regionCount: integer("region_count"),
  requiredFor100Percent: boolean("required_for_100_percent")
    .notNull()
    .default(false)
});

export const mapMarkers = pgTable(
  "map_markers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    entityId: uuid("entity_id").references(() => entities.id, {
      onDelete: "set null"
    }),
    markerType: text("marker_type").notNull(),
    title: text("title").notNull(),
    slug: text("slug"),
    description: text("description"),
    regionEntityId: uuid("region_entity_id").references(() => entities.id),
    xCoordinate: numeric("x_coordinate", { precision: 12, scale: 6 }),
    yCoordinate: numeric("y_coordinate", { precision: 12, scale: 6 }),
    zCoordinate: numeric("z_coordinate", { precision: 12, scale: 6 }),
    latitude: numeric("latitude", { precision: 12, scale: 8 }),
    longitude: numeric("longitude", { precision: 12, scale: 8 }),
    verification: verificationStatus("verification")
      .notNull()
      .default("speculative"),
    confidenceScore: integer("confidence_score").notNull().default(0),
    status: recordStatus("status").notNull().default("draft"),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    ...timestamps
  },
  (table) => ({
    gameTypeIdx: index("idx_map_markers_game_type").on(
      table.gameId,
      table.markerType
    ),
    entityIdx: index("idx_map_markers_entity").on(table.entityId),
    statusIdx: index("idx_map_markers_status").on(
      table.status,
      table.verification
    )
  })
);

export const guides = pgTable(
  "guides",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    guideType: text("guide_type").notNull(),
    summary: text("summary"),
    bodyMd: text("body_md"),
    status: recordStatus("status").notNull().default("draft"),
    verification: verificationStatus("verification")
      .notNull()
      .default("speculative"),
    seoTitle: text("seo_title"),
    metaDescription: text("meta_description"),
    canonicalUrl: text("canonical_url"),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...timestamps
  },
  (table) => ({
    guideSlugUnique: unique("guides_game_slug_unique").on(
      table.gameId,
      table.slug
    )
  })
);

export const guideEntities = pgTable(
  "guide_entities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    guideId: uuid("guide_id")
      .notNull()
      .references(() => guides.id, { onDelete: "cascade" }),
    entityId: uuid("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    relationshipType: text("relationship_type").notNull().default("related")
  },
  (table) => ({
    guideEntityUnique: unique("guide_entity_relationship_unique").on(
      table.guideId,
      table.entityId,
      table.relationshipType
    )
  })
);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  authUserId: uuid("auth_user_id").unique(),
  displayName: text("display_name"),
  ...timestamps
});

export const userProgress = pgTable(
  "user_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    entityId: uuid("entity_id").references(() => entities.id, {
      onDelete: "cascade"
    }),
    markerId: uuid("marker_id").references(() => mapMarkers.id, {
      onDelete: "cascade"
    }),
    progressType: text("progress_type").notNull(),
    data: jsonb("data").notNull().default({}),
    ...timestamps
  },
  (table) => ({
    progressUnique: unique("user_progress_unique").on(
      table.userId,
      table.gameId,
      table.entityId,
      table.markerId,
      table.progressType
    )
  })
);

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, {
    onDelete: "set null"
  }),
  gameId: uuid("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  submissionType: text("submission_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  evidenceUrl: text("evidence_url"),
  screenshotUrl: text("screenshot_url"),
  proposedEntityId: uuid("proposed_entity_id").references(() => entities.id),
  proposedMarkerId: uuid("proposed_marker_id").references(() => mapMarkers.id),
  aiSummary: text("ai_summary"),
  duplicateScore: numeric("duplicate_score", { precision: 5, scale: 2 }),
  status: submissionStatus("status").notNull().default("new"),
  moderatorNotes: text("moderator_notes"),
  ...timestamps
});

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    // Related entity (character, vehicle, mission, location, ...). Optional so
    // brand/hero art that is not tied to a single record can still be stored.
    entityId: uuid("entity_id").references(() => entities.id, {
      onDelete: "set null"
    }),
    type: mediaType("type").notNull(),
    provenance: mediaProvenance("provenance").notNull().default("placeholder"),
    title: text("title").notNull(),
    caption: text("caption"),
    altText: text("alt_text"),
    // Where the file lives: a local path under /public, or an external URL.
    filePath: text("file_path"),
    externalUrl: text("external_url"),
    // Attribution metadata.
    sourceName: text("source_name"),
    copyrightOwner: text("copyright_owner"),
    originalUrl: text("original_url"),
    attributionRequired: boolean("attribution_required")
      .notNull()
      .default(true),
    attributionText: text("attribution_text"),
    width: integer("width"),
    height: integer("height"),
    isFeatured: boolean("is_featured").notNull().default(false),
    status: recordStatus("status").notNull().default("draft"),
    ...timestamps
  },
  (table) => ({
    gameTypeIdx: index("idx_media_assets_game_type").on(
      table.gameId,
      table.type
    ),
    entityIdx: index("idx_media_assets_entity").on(table.entityId),
    featuredIdx: index("idx_media_assets_featured").on(
      table.status,
      table.isFeatured
    )
  })
);

export const recordVersions = pgTable("record_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tableName: text("table_name").notNull(),
  recordId: uuid("record_id").notNull(),
  previousData: jsonb("previous_data"),
  newData: jsonb("new_data").notNull().default({}),
  changedFields: text("changed_fields").array().notNull().default([]),
  changedByProfileId: uuid("changed_by_profile_id").references(
    () => profiles.id,
    {
      onDelete: "set null"
    }
  ),
  changeReason: text("change_reason"),
  sourceId: uuid("source_id").references(() => sources.id, {
    onDelete: "set null"
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow()
});
