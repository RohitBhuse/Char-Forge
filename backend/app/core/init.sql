-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create dedicated schema
CREATE SCHEMA IF NOT EXISTS charforge_schema;
SET search_path TO charforge_schema, public;

-- Create status enum type
DO $$ BEGIN
    CREATE TYPE character_status AS ENUM ('New', 'Updated', 'Copied');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ─────────────────────────────────────────
-- USERS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    user_id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name            VARCHAR     NOT NULL,
    user_email           VARCHAR     NOT NULL UNIQUE,
    hashed_password      VARCHAR     NOT NULL,
    genres               VARCHAR,
    architectural_style  VARCHAR,
    onboarding_completed BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at           TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- UNIVERSE TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS universe (
    universe_id          SERIAL      PRIMARY KEY,
    user_id              UUID        NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    universe_name        VARCHAR     NOT NULL,
    universe_description VARCHAR,
    created_at           TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- WORLD TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS world (
    world_id          SERIAL      PRIMARY KEY,
    user_id           UUID        NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    universe_id       INT         NOT NULL REFERENCES universe(universe_id) ON DELETE CASCADE,
    world_name        VARCHAR     NOT NULL,
    world_description VARCHAR,
    world_timeline    DATE,
    attributes        JSONB       DEFAULT '{}',
    created_at        TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- CHARACTER TABLE (GLOBAL IDENTITY)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS character (
    character_id           SERIAL              PRIMARY KEY,
    user_id                UUID                NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    universe_id            INT                 NOT NULL REFERENCES universe(universe_id) ON DELETE CASCADE,
    character_name         VARCHAR             NOT NULL,
    core_description       VARCHAR,
    created_at             TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at             TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- CHARACTER VARIANT TABLE (PER WORLD)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS character_variant (
    variant_id             SERIAL              PRIMARY KEY,
    character_id           INT                 NOT NULL REFERENCES character(character_id) ON DELETE CASCADE,
    world_id               INT                 NOT NULL REFERENCES world(world_id) ON DELETE CASCADE,
    variant_name           VARCHAR             NOT NULL,
    attributes             JSONB               DEFAULT '{}',
    status                 character_status    NOT NULL DEFAULT 'New',
    created_at             TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at             TIMESTAMP           NOT NULL DEFAULT NOW(),
    UNIQUE(character_id, world_id)
);

-- ─────────────────────────────────────────
-- CHARACTER RELATIONSHIP TABLE (GRAPH LAYER)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS character_relationship (
    relationship_id        SERIAL              PRIMARY KEY,
    from_variant_id        INT                 NOT NULL REFERENCES character_variant(variant_id) ON DELETE CASCADE,
    to_variant_id          INT                 NOT NULL REFERENCES character_variant(variant_id) ON DELETE CASCADE,
    relationship_type      VARCHAR             NOT NULL,
    metadata               JSONB               DEFAULT '{}',
    created_at             TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- EVENTS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event (
    event_id               SERIAL              PRIMARY KEY,
    world_id               INT                 NOT NULL REFERENCES world(world_id) ON DELETE CASCADE,
    event_name             VARCHAR             NOT NULL,
    event_description      VARCHAR,
    created_at             TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- CHARACTER EVENTS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS character_event (
    id                     SERIAL              PRIMARY KEY,
    variant_id             INT                 NOT NULL REFERENCES character_variant(variant_id) ON DELETE CASCADE,
    event_id               INT                 NOT NULL REFERENCES event(event_id) ON DELETE CASCADE,
    role                   VARCHAR,
    created_at             TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_universe_user_id       ON universe(user_id);
CREATE INDEX IF NOT EXISTS idx_world_universe_id      ON world(universe_id);
CREATE INDEX IF NOT EXISTS idx_character_user_id      ON character(user_id);
CREATE INDEX IF NOT EXISTS idx_character_universe_id  ON character(universe_id);
CREATE INDEX IF NOT EXISTS idx_variant_character_id   ON character_variant(character_id);
CREATE INDEX IF NOT EXISTS idx_variant_world_id       ON character_variant(world_id);
CREATE INDEX IF NOT EXISTS idx_rel_from_variant       ON character_relationship(from_variant_id);
CREATE INDEX IF NOT EXISTS idx_rel_to_variant         ON character_relationship(to_variant_id);
CREATE INDEX IF NOT EXISTS idx_event_world_id         ON event(world_id);
CREATE INDEX IF NOT EXISTS idx_char_event_variant     ON character_event(variant_id);
CREATE INDEX IF NOT EXISTS idx_char_event_event       ON character_event(event_id);

-- GIN indexes for JSONB performance
CREATE INDEX IF NOT EXISTS idx_world_attributes       ON world USING GIN (attributes);
CREATE INDEX IF NOT EXISTS idx_variant_attributes     ON character_variant USING GIN (attributes);
