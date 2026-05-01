-- Database: char_forge_db

-- The database creation is handled by the Docker environment variables
-- CREATE DATABASE char_forge_db
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'en_US.utf8'
--     LC_CTYPE = 'en_US.utf8'
--     LOCALE_PROVIDER = 'libc'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1
--     IS_TEMPLATE = False;



-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create dedicated schema
CREATE SCHEMA IF NOT EXISTS charforge_schema;
SET search_path TO charforge_schema, public;

-- Create status enum type
CREATE TYPE character_status AS ENUM ('New', 'Updated', 'Copied');

-- ─────────────────────────────────────────
-- USERS TABLE
-- ─────────────────────────────────────────
CREATE TABLE users (
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
CREATE TABLE universe (
    universe_id          SERIAL      PRIMARY KEY,
    user_id              UUID        NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    universe_name        VARCHAR     NOT NULL,
    universe_description VARCHAR,
    created_at           TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- WORLD TABLE
-- ─────────────────────────────────────────
CREATE TABLE world (
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
CREATE TABLE character (
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
CREATE INDEX idx_universe_user_id     ON universe(user_id);
CREATE INDEX idx_universe_universe_id ON universe(universe_id);

-- ─────────────────────────────────────────
-- INDEXES ON WORLD TABLE
-- ─────────────────────────────────────────
CREATE INDEX idx_world_user_id      ON world(user_id);
CREATE INDEX idx_world_universe_id  ON world(universe_id);
CREATE INDEX idx_world_world_id     ON world(world_id);

-- ─────────────────────────────────────────
-- INDEXES ON CHARACTER TABLE
-- ─────────────────────────────────────────
CREATE INDEX idx_character_user_id      ON character(user_id);
CREATE INDEX idx_character_universe_id  ON character(universe_id);
CREATE INDEX idx_character_world_id     ON character(world_id);
CREATE INDEX idx_character_character_id ON character(character_id);

-- ─────────────────────────────────────────
-- AUTO-UPDATE updated_at ON CHARACTER
-- ─────────────────────────────────────────
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER trg_character_updated_at
-- BEFORE UPDATE ON character
-- FOR EACH ROW
-- EXECUTE FUNCTION update_updated_at_column();