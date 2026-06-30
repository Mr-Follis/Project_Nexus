-- Project Nexus Database Schema v0.1
-- Target: PostgreSQL
-- Notes: This is a build-start schema, not a final migration. Review with engineering before production.

create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- ENUMS
create type record_status as enum ('draft', 'published', 'hidden', 'archived');
create type verification_status as enum ('confirmed_official', 'confirmed_gameplay', 'community_verified', 'likely', 'speculative', 'outdated', 'rejected');
create type source_type as enum ('official', 'direct_gameplay', 'trusted_community', 'user_submission', 'editorial_research', 'third_party_article', 'unknown');
create type entity_type as enum ('region', 'vehicle', 'weapon', 'mission', 'character', 'business', 'property', 'shop', 'collectible', 'achievement', 'activity', 'faction', 'animal', 'patch_note', 'guide', 'other');
create type submission_status as enum ('new', 'needs_more_info', 'duplicate', 'approved', 'rejected', 'spam');

-- CORE TABLES
create table games (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  release_date date,
  platforms text[] default '{}',
  status record_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table entities (
  id uuid primary key default uuid_generate_v4(),
  game_id uuid not null references games(id) on delete cascade,
  type entity_type not null,
  name text not null,
  slug text not null,
  summary text,
  description text,
  status record_status not null default 'draft',
  verification verification_status not null default 'speculative',
  confidence_score int not null default 0 check (confidence_score >= 0 and confidence_score <= 100),
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (game_id, slug)
);

create index idx_entities_game_type on entities(game_id, type);
create index idx_entities_status_verification on entities(status, verification);
create index idx_entities_name_trgm on entities using gin (to_tsvector('english', name || ' ' || coalesce(summary,'')));

create table entity_aliases (
  id uuid primary key default uuid_generate_v4(),
  entity_id uuid not null references entities(id) on delete cascade,
  alias text not null,
  created_at timestamptz not null default now()
);

create table entity_relationships (
  id uuid primary key default uuid_generate_v4(),
  game_id uuid not null references games(id) on delete cascade,
  from_entity_id uuid not null references entities(id) on delete cascade,
  to_entity_id uuid not null references entities(id) on delete cascade,
  relationship_type text not null,
  confidence_score int not null default 0 check (confidence_score >= 0 and confidence_score <= 100),
  verification verification_status not null default 'speculative',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (from_entity_id, to_entity_id, relationship_type)
);

create index idx_relationships_from on entity_relationships(from_entity_id, relationship_type);
create index idx_relationships_to on entity_relationships(to_entity_id, relationship_type);

-- SOURCES
create table sources (
  id uuid primary key default uuid_generate_v4(),
  game_id uuid references games(id) on delete cascade,
  type source_type not null,
  title text,
  url text,
  author text,
  published_at timestamptz,
  accessed_at timestamptz,
  reliability_score int not null default 50 check (reliability_score >= 0 and reliability_score <= 100),
  permission_notes text,
  notes text,
  created_at timestamptz not null default now()
);

create table entity_sources (
  id uuid primary key default uuid_generate_v4(),
  entity_id uuid not null references entities(id) on delete cascade,
  source_id uuid not null references sources(id) on delete cascade,
  claim text,
  field_name text,
  created_at timestamptz not null default now(),
  unique(entity_id, source_id, field_name)
);

-- EXTENSION TABLES
create table vehicles (
  entity_id uuid primary key references entities(id) on delete cascade,
  category text,
  manufacturer text,
  price numeric(12,2),
  top_speed numeric(8,2),
  acceleration numeric(5,2),
  handling numeric(5,2),
  braking numeric(5,2),
  seats int,
  acquisition_methods text[],
  unlock_condition text,
  customisation_notes text,
  best_use_case text
);

create table weapons (
  entity_id uuid primary key references entities(id) on delete cascade,
  category text,
  damage numeric(5,2),
  range_score numeric(5,2),
  fire_rate numeric(5,2),
  accuracy numeric(5,2),
  price numeric(12,2),
  ammo_type text,
  unlock_condition text,
  attachments text[],
  best_use_case text
);

create table missions (
  entity_id uuid primary key references entities(id) on delete cascade,
  character_entity_id uuid references entities(id),
  region_entity_id uuid references entities(id),
  mission_order int,
  spoiler_level int not null default 1,
  unlock_requirements text,
  objectives jsonb default '[]'::jsonb,
  rewards jsonb default '{}'::jsonb,
  walkthrough text,
  fail_points text[],
  recommended_loadout text
);

create table businesses (
  entity_id uuid primary key references entities(id) on delete cascade,
  category text,
  purchase_price numeric(12,2),
  expected_income numeric(12,2),
  income_interval_minutes int,
  upgrade_costs jsonb default '{}'::jsonb,
  roi_notes text,
  risk_level text,
  solo_friendly boolean
);

create table collectibles (
  entity_id uuid primary key references entities(id) on delete cascade,
  collection_name text,
  reward jsonb default '{}'::jsonb,
  total_count int,
  region_count int,
  required_for_100_percent boolean default false
);

-- MAP
create table map_markers (
  id uuid primary key default uuid_generate_v4(),
  game_id uuid not null references games(id) on delete cascade,
  entity_id uuid references entities(id) on delete set null,
  marker_type text not null,
  title text not null,
  slug text,
  description text,
  region_entity_id uuid references entities(id),
  x_coordinate numeric(12,6),
  y_coordinate numeric(12,6),
  z_coordinate numeric(12,6),
  latitude numeric(12,8),
  longitude numeric(12,8),
  verification verification_status not null default 'speculative',
  confidence_score int not null default 0 check (confidence_score >= 0 and confidence_score <= 100),
  status record_status not null default 'draft',
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_map_markers_game_type on map_markers(game_id, marker_type);
create index idx_map_markers_entity on map_markers(entity_id);
create index idx_map_markers_status on map_markers(status, verification);

-- GUIDES / CONTENT
create table guides (
  id uuid primary key default uuid_generate_v4(),
  game_id uuid not null references games(id) on delete cascade,
  title text not null,
  slug text not null,
  guide_type text not null,
  summary text,
  body_md text,
  status record_status not null default 'draft',
  verification verification_status not null default 'speculative',
  seo_title text,
  meta_description text,
  canonical_url text,
  last_verified_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(game_id, slug)
);

create table guide_entities (
  id uuid primary key default uuid_generate_v4(),
  guide_id uuid not null references guides(id) on delete cascade,
  entity_id uuid not null references entities(id) on delete cascade,
  relationship_type text not null default 'related',
  unique (guide_id, entity_id, relationship_type)
);

-- USER / PROGRESS
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid unique,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  game_id uuid not null references games(id) on delete cascade,
  entity_id uuid references entities(id) on delete cascade,
  marker_id uuid references map_markers(id) on delete cascade,
  progress_type text not null, -- saved, found, completed, hidden, favourite
  data jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, game_id, entity_id, marker_id, progress_type)
);

-- COMMUNITY SUBMISSIONS
create table submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  game_id uuid not null references games(id) on delete cascade,
  submission_type text not null,
  title text not null,
  description text,
  evidence_url text,
  screenshot_url text,
  proposed_entity_id uuid references entities(id),
  proposed_marker_id uuid references map_markers(id),
  ai_summary text,
  duplicate_score numeric(5,2),
  status submission_status not null default 'new',
  moderator_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_submissions_status on submissions(status, created_at desc);

-- AI / RETRIEVAL
create table ai_chunks (
  id uuid primary key default uuid_generate_v4(),
  game_id uuid not null references games(id) on delete cascade,
  entity_id uuid references entities(id) on delete cascade,
  guide_id uuid references guides(id) on delete cascade,
  marker_id uuid references map_markers(id) on delete cascade,
  chunk_type text not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  embedding vector(1536),
  status record_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_ai_chunks_game_type on ai_chunks(game_id, chunk_type);
-- Create vector index after choosing embedding dimensions and pgvector index strategy.
-- Example: create index on ai_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create table ai_question_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  game_id uuid references games(id) on delete set null,
  question text not null,
  answer_summary text,
  intent text,
  retrieval_count int,
  helpful boolean,
  failed_reason text,
  created_at timestamptz not null default now()
);

-- AUDIT
create table audit_log (
  id uuid primary key default uuid_generate_v4(),
  actor_user_id uuid references profiles(id) on delete set null,
  table_name text not null,
  record_id uuid not null,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  reason text,
  created_at timestamptz not null default now()
);

-- SEO
create table seo_pages (
  id uuid primary key default uuid_generate_v4(),
  game_id uuid not null references games(id) on delete cascade,
  page_type text not null,
  slug text not null,
  title text not null,
  meta_description text,
  h1 text,
  template_key text,
  related_entity_ids uuid[] default '{}',
  status record_status not null default 'draft',
  last_generated_at timestamptz,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(game_id, slug)
);

-- ANALYTICS EVENT STUB
create table product_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  anonymous_id text,
  event_name text not null,
  game_id uuid references games(id) on delete set null,
  properties jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
