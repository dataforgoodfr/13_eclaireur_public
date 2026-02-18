import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const POPULATION_THRESHOLD = 3500;
const CURRENT_YEAR = new Date().getFullYear();

// Pinned to the latest year with reasonably complete data for both marchés
// publics AND subventions.  The bareme table contains rows up to 2026 but
// 2025/2026 data is far too sparse (especially subventions) to be meaningful.
// Bump this value once a full year of data has been ingested for the next year.
const REFERENCE_SCORE_YEAR = 2024;

// Outlier thresholds — amounts above these values are excluded from totals.
// For marchés publics we rely on the `montant_aberrant` flag set by the ETL.
// For subventions there is no such flag yet (TODO: switch to montant_aberrant
// once the column is added to the subventions table by the ETL pipeline).
const SUBVENTIONS_OUTLIER_THRESHOLD = 1_000_000_000; // 1 Md€

export type PerspectivesKPIs = {
  referenceYear: number;
  totalCollectivites: number;
  totalCommunes: number;
  communesSoumises: number;
  totalDepartements: number;
  totalRegions: number;
  totalIntercommunalites: number;
  collectivitesSoumises: number;
  totalMarchesPublics: number;
  totalSubventions: number;
  mpMontantTotal: number;
  subMontantTotal: number;
  pctScoreABMp: number;
  pctScoreABSub: number;
  mpCoverage: number;
  subCoverage: number;
};

export type ScoreDistribution = {
  type: string;
  annee: number;
  score: string;
  count: number;
};

export type YearlyVolume = {
  year: number;
  mp_count: number;
  mp_total: number;
  mp_buyers: number;
  sub_count: number;
  sub_total: number;
  sub_grantors: number;
};

// Condition SQL pour filtrer les collectivités soumises à la loi
// Communes >= 3500 habitants + tous les départements, régions, intercommunalités
const SOUMISES_CONDITION = `(c.type != 'COM' OR c.population >= ${POPULATION_THRESHOLD})`;

// Condition SQL pour exclure les montants aberrants des marchés publics
const MP_CLEAN_AMOUNT = `(montant_aberrant IS NULL OR montant_aberrant = false)`;

// Condition SQL pour exclure les montants aberrants des subventions
// TODO: replace with montant_aberrant flag once added to the subventions table
const SUB_CLEAN_AMOUNT = `(montant <= ${SUBVENTIONS_OUTLIER_THRESHOLD})`;

export async function fetchPerspectivesKPIs(): Promise<PerspectivesKPIs> {
  const kpisQuery = `
    WITH collectivite_counts AS (
      SELECT
        COUNT(*)::integer AS total,
        COUNT(*) FILTER (WHERE c.type = 'COM')::integer AS communes,
        COUNT(*) FILTER (WHERE c.type = 'COM' AND c.population >= ${POPULATION_THRESHOLD})::integer AS communes_soumises,
        COUNT(*) FILTER (WHERE c.type = 'DEP')::integer AS departements,
        COUNT(*) FILTER (WHERE c.type = 'REG')::integer AS regions,
        COUNT(*) FILTER (WHERE c.type = 'GRP')::integer AS intercommunalites,
        COUNT(*) FILTER (WHERE ${SOUMISES_CONDITION})::integer AS soumises
      FROM ${DataTable.Communities} c
    ),
    mp_stats AS (
      SELECT
        COUNT(*)::integer AS total,
        COALESCE(SUM(CASE WHEN ${MP_CLEAN_AMOUNT} THEN montant_du_marche_public_par_titulaire ELSE 0 END), 0)::bigint AS montant_total
      FROM ${DataTable.MarchesPublics}
    ),
    sub_stats AS (
      SELECT
        COUNT(*)::integer AS total,
        COALESCE(SUM(CASE WHEN ${SUB_CLEAN_AMOUNT} THEN montant ELSE 0 END), 0)::bigint AS montant_total
      FROM ${DataTable.Subventions}
    ),
    mp_coverage AS (
      SELECT COUNT(DISTINCT mp.acheteur_id)::integer AS buyers
      FROM ${DataTable.MarchesPublics} mp
      JOIN ${DataTable.Communities} c ON c.siren = mp.acheteur_id
      WHERE ${SOUMISES_CONDITION}
    ),
    sub_coverage AS (
      SELECT COUNT(DISTINCT sub.id_attribuant)::integer AS grantors
      FROM ${DataTable.Subventions} sub
      JOIN ${DataTable.Communities} c ON c.siren = sub.id_attribuant
      WHERE ${SOUMISES_CONDITION}
    ),
    score_ab AS (
      SELECT
        COUNT(*) FILTER (WHERE b.mp_score IN ('A', 'B'))::integer AS mp_ab,
        COUNT(*) FILTER (WHERE b.subventions_score IN ('A', 'B'))::integer AS sub_ab,
        COUNT(*)::integer AS total
      FROM ${DataTable.Bareme} b
      JOIN ${DataTable.Communities} c ON c.siren = b.siren
      WHERE b.annee = ${REFERENCE_SCORE_YEAR}
        AND ${SOUMISES_CONDITION}
    )
    SELECT
      ${REFERENCE_SCORE_YEAR} AS "referenceYear",
      c.total AS "totalCollectivites",
      c.communes AS "totalCommunes",
      c.communes_soumises AS "communesSoumises",
      c.departements AS "totalDepartements",
      c.regions AS "totalRegions",
      c.intercommunalites AS "totalIntercommunalites",
      c.soumises AS "collectivitesSoumises",
      mp.total AS "totalMarchesPublics",
      sub.total AS "totalSubventions",
      mp.montant_total AS "mpMontantTotal",
      sub.montant_total AS "subMontantTotal",
      CASE WHEN s.total > 0 THEN ROUND(s.mp_ab * 100.0 / s.total, 1) ELSE 0 END AS "pctScoreABMp",
      CASE WHEN s.total > 0 THEN ROUND(s.sub_ab * 100.0 / s.total, 1) ELSE 0 END AS "pctScoreABSub",
      mc.buyers AS "mpCoverage",
      sc.grantors AS "subCoverage"
    FROM collectivite_counts c,
         mp_stats mp,
         sub_stats sub,
         score_ab s,
         mp_coverage mc,
         sub_coverage sc
  `;

  const rows = await getQueryFromPool(kpisQuery);
  if (!rows || rows.length === 0) {
    return {
      referenceYear: REFERENCE_SCORE_YEAR,
      totalCollectivites: 0,
      totalCommunes: 0,
      communesSoumises: 0,
      totalDepartements: 0,
      totalRegions: 0,
      totalIntercommunalites: 0,
      collectivitesSoumises: 0,
      totalMarchesPublics: 0,
      totalSubventions: 0,
      mpMontantTotal: 0,
      subMontantTotal: 0,
      pctScoreABMp: 0,
      pctScoreABSub: 0,
      mpCoverage: 0,
      subCoverage: 0,
    };
  }
  return rows[0] as PerspectivesKPIs;
}

export async function fetchMpScoreDistribution(): Promise<ScoreDistribution[]> {
  const query = `
    SELECT
      c.type,
      b.annee,
      b.mp_score AS score,
      COUNT(*)::integer AS count
    FROM ${DataTable.Bareme} b
    JOIN ${DataTable.Communities} c ON c.siren = b.siren
    WHERE b.annee >= 2019
      AND b.annee <= ${CURRENT_YEAR - 1}
      AND b.mp_score IS NOT NULL
      AND ${SOUMISES_CONDITION}
    GROUP BY c.type, b.annee, b.mp_score
    ORDER BY c.type, b.annee, b.mp_score
  `;

  const rows = await getQueryFromPool(query);
  return (rows || []) as ScoreDistribution[];
}

export async function fetchSubScoreDistribution(): Promise<ScoreDistribution[]> {
  const query = `
    SELECT
      c.type,
      b.annee,
      b.subventions_score AS score,
      COUNT(*)::integer AS count
    FROM ${DataTable.Bareme} b
    JOIN ${DataTable.Communities} c ON c.siren = b.siren
    WHERE b.annee >= 2019
      AND b.annee <= ${CURRENT_YEAR - 1}
      AND b.subventions_score IS NOT NULL
      AND ${SOUMISES_CONDITION}
    GROUP BY c.type, b.annee, b.subventions_score
    ORDER BY c.type, b.annee, b.subventions_score
  `;

  const rows = await getQueryFromPool(query);
  return (rows || []) as ScoreDistribution[];
}

export async function fetchYearlyVolumes(): Promise<YearlyVolume[]> {
  const query = `
    WITH mp_yearly AS (
      SELECT
        annee_notification::integer AS year,
        COUNT(*)::integer AS count,
        SUM(CASE WHEN ${MP_CLEAN_AMOUNT} THEN montant_du_marche_public_par_titulaire ELSE 0 END)::bigint AS total,
        COUNT(DISTINCT acheteur_id)::integer AS buyers
      FROM ${DataTable.MarchesPublics}
      WHERE annee_notification IS NOT NULL
        AND annee_notification >= 2016
        AND annee_notification <= ${CURRENT_YEAR - 1}
      GROUP BY annee_notification
    ),
    sub_yearly AS (
      SELECT
        annee::integer AS year,
        COUNT(*)::integer AS count,
        SUM(CASE WHEN ${SUB_CLEAN_AMOUNT} THEN montant ELSE 0 END)::bigint AS total,
        COUNT(DISTINCT id_attribuant)::integer AS grantors
      FROM ${DataTable.Subventions}
      WHERE annee IS NOT NULL
        AND annee >= 2016
        AND annee <= ${CURRENT_YEAR - 1}
      GROUP BY annee
    )
    SELECT
      COALESCE(m.year, s.year) AS year,
      COALESCE(m.count, 0) AS mp_count,
      COALESCE(m.total, 0) AS mp_total,
      COALESCE(m.buyers, 0) AS mp_buyers,
      COALESCE(s.count, 0) AS sub_count,
      COALESCE(s.total, 0) AS sub_total,
      COALESCE(s.grantors, 0) AS sub_grantors
    FROM mp_yearly m
    FULL OUTER JOIN sub_yearly s ON m.year = s.year
    ORDER BY year
  `;

  const rows = await getQueryFromPool(query);
  return (rows || []) as YearlyVolume[];
}
