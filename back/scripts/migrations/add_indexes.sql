-- Performance indexes for Éclaireur Public production database.
--
-- These indexes target the columns most frequently used in WHERE, JOIN and
-- ORDER BY clauses across the frontend API routes.
--
-- Run after each ETL load (indexes are created with IF NOT EXISTS so it is
-- safe to re-run).

-- ============================================================
-- bareme table
-- Used in every map/community query via JOIN on (siren, annee)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bareme_siren_annee
    ON bareme (siren, annee);

-- ============================================================
-- collectivites table
-- Primary lookup by siren (community page, joins)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_collectivites_siren
    ON collectivites (siren);

-- Map queries filter by code_insee (communes, départements)
CREATE INDEX IF NOT EXISTS idx_collectivites_code_insee
    ON collectivites (code_insee);

-- Map regions query filters by code_insee_region
CREATE INDEX IF NOT EXISTS idx_collectivites_code_insee_region
    ON collectivites (code_insee_region);

-- Map départements query filters by code_insee_dept
CREATE INDEX IF NOT EXISTS idx_collectivites_code_insee_dept
    ON collectivites (code_insee_dept);

-- Advanced search filters by type
CREATE INDEX IF NOT EXISTS idx_collectivites_type
    ON collectivites (type);

-- Search uses SIMILARITY on nom – a trigram GIN index speeds this up.
-- Requires pg_trgm extension (usually already enabled on managed Postgres).
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_collectivites_nom_trgm
    ON collectivites USING gin (nom gin_trgm_ops);

-- ============================================================
-- marches_publics table
-- Community page queries filter by acheteur_id (+ annee_notification)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_marches_acheteur_id
    ON marches_publics (acheteur_id);

CREATE INDEX IF NOT EXISTS idx_marches_acheteur_annee
    ON marches_publics (acheteur_id, annee_notification);

-- ============================================================
-- subventions table
-- Community page queries filter by id_attribuant (+ annee)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_subventions_id_attribuant
    ON subventions (id_attribuant);

CREATE INDEX IF NOT EXISTS idx_subventions_attribuant_annee
    ON subventions (id_attribuant, annee);

-- ============================================================
-- comptes_collectivites table
-- Advanced search LEFT JOIN LATERAL fetches the most recent budget
-- by siren, ordered by annee DESC. Without this index the lateral
-- join does a full sequential scan (~45 ms/row).
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_comptes_siren_annee
    ON comptes_collectivites (siren, annee DESC);

-- ============================================================
-- interpellation_logs table
-- Tracks interpellation emails sent (no personal data).
-- Created here so the ETL does not drop it during table reloads.
-- ============================================================
CREATE TABLE IF NOT EXISTS interpellation_logs (
    id SERIAL PRIMARY KEY,
    siren VARCHAR(9) NOT NULL,
    community_name TEXT NOT NULL,
    community_type TEXT NOT NULL,
    nb_contacts INTEGER NOT NULL,
    has_copy BOOLEAN NOT NULL DEFAULT false,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interpellation_logs_siren
    ON interpellation_logs (siren);

CREATE INDEX IF NOT EXISTS idx_interpellation_logs_sent_at
    ON interpellation_logs (sent_at DESC);
