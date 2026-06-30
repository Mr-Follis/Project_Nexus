export type RecordStatus = "draft" | "published" | "hidden" | "archived";

export type VerificationStatus =
  | "confirmed_official"
  | "confirmed_gameplay"
  | "community_verified"
  | "likely"
  | "speculative"
  | "outdated"
  | "rejected";

export type EntityType =
  | "region"
  | "vehicle"
  | "weapon"
  | "mission"
  | "character"
  | "business"
  | "property"
  | "shop"
  | "collectible"
  | "achievement"
  | "activity"
  | "faction"
  | "animal"
  | "patch_note"
  | "guide"
  | "other";
