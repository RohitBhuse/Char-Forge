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
    attribute_list    VARCHAR,
    created_at        TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- CHARACTER TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS character (
    character_id           SERIAL              PRIMARY KEY,
    user_id                UUID                NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    universe_id            INT                 NOT NULL REFERENCES universe(universe_id) ON DELETE CASCADE,
    world_id               INT                 NOT NULL REFERENCES world(world_id) ON DELETE CASCADE,
    character_name         VARCHAR             NOT NULL,
    character_attribute    JSONB,
    status                 character_status    NOT NULL DEFAULT 'New',
    created_at             TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at             TIMESTAMP           NOT NULL DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- INDEXES ON UNIVERSE TABLE
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_universe_user_id     ON universe(user_id);
CREATE INDEX IF NOT EXISTS idx_universe_universe_id ON universe(universe_id);

-- ─────────────────────────────────────────
-- INDEXES ON WORLD TABLE
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_world_user_id      ON world(user_id);
CREATE INDEX IF NOT EXISTS idx_world_universe_id  ON world(universe_id);
CREATE INDEX IF NOT EXISTS idx_world_world_id     ON world(world_id);

-- ─────────────────────────────────────────
-- INDEXES ON CHARACTER TABLE
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_character_user_id      ON character(user_id);
CREATE INDEX IF NOT EXISTS idx_character_universe_id  ON character(universe_id);
CREATE INDEX IF NOT EXISTS idx_character_world_id     ON character(world_id);
CREATE INDEX IF NOT EXISTS idx_character_character_id ON character(character_id);
