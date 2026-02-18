import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const POPULATION_THRESHOLD = 3500;
const REFERENCE_SCORE_YEAR = 2024;
const SUBVENTIONS_OUTLIER_THRESHOLD = 1_000_000_000; // 1 Md€

// Aligné sur fetchPerspectivesData : communes >= 3500 hab + DEP + REG + GRP
const SOUMISES_CONDITION = `(c.type != 'COM' OR c.population >= ${POPULATION_THRESHOLD})`;

// Aligné sur fetchPerspectivesData : même logique de filtrage outliers
const MP_CLEAN_AMOUNT = `(montant_aberrant IS NULL OR montant_aberrant = false)`;
const SUB_CLEAN_AMOUNT = `(montant <= ${SUBVENTIONS_OUTLIER_THRESHOLD})`;

export type HomeKPIs = {
  collectivitesSoumises: number;
  montantTotal: number;
  pctScoreABMp: number;
  pctSubPubliees: number;
};

const KPI_QUERY = `
  WITH soumises AS (
    SELECT COUNT(*)::integer AS count
    FROM ${DataTable.Communities} c
    WHERE ${SOUMISES_CONDITION}
  ),
  montants_mp AS (
    SELECT COALESCE(SUM(CASE WHEN ${MP_CLEAN_AMOUNT}
                             THEN montant_du_marche_public_par_titulaire ELSE 0 END), 0)::bigint AS total
    FROM ${DataTable.MarchesPublics}
  ),
  montants_sub AS (
    SELECT COALESCE(SUM(CASE WHEN ${SUB_CLEAN_AMOUNT} THEN montant ELSE 0 END), 0)::bigint AS total
    FROM ${DataTable.Subventions}
  ),
  score_mp AS (
    SELECT
      COUNT(*) FILTER (WHERE b.mp_score IN ('A', 'B'))::integer AS mp_ab,
      COUNT(*)::integer AS total
    FROM ${DataTable.Bareme} b
    JOIN ${DataTable.Communities} c ON c.siren = b.siren
    WHERE b.annee = ${REFERENCE_SCORE_YEAR}
      AND ${SOUMISES_CONDITION}
  ),
  sub_pct AS (
    SELECT
      COALESCE(SUM(CASE WHEN ${SUB_CLEAN_AMOUNT} THEN montant ELSE 0 END), 0) AS published,
      (SELECT COALESCE(SUM(subventions), 1) FROM ${DataTable.CommunitiesAccount} WHERE annee = ${REFERENCE_SCORE_YEAR}) AS budget
    FROM ${DataTable.Subventions}
    WHERE annee = ${REFERENCE_SCORE_YEAR}
  )
  SELECT
    s.count AS "collectivitesSoumises",
    (mmp.total + msub.total)::bigint AS "montantTotal",
    CASE WHEN smp.total > 0 THEN ROUND((smp.mp_ab * 100.0 / smp.total)::numeric)::integer ELSE 0 END AS "pctScoreABMp",
    CASE WHEN sp.budget > 0 THEN ROUND((sp.published * 100.0 / sp.budget)::numeric)::integer ELSE 0 END AS "pctSubPubliees"
  FROM soumises s, montants_mp mmp, montants_sub msub, score_mp smp, sub_pct sp
`;

export async function fetchKPIs(): Promise<HomeKPIs> {
  const rows = (await getQueryFromPool(KPI_QUERY)) as HomeKPIs[];

  if (!rows || rows.length === 0) {
    return { collectivitesSoumises: 0, montantTotal: 0, pctScoreABMp: 0, pctSubPubliees: 0 };
  }

  return rows[0];
}
