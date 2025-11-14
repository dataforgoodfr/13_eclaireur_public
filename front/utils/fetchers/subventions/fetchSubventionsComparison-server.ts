import type { SubventionsComparisonData } from '#app/models/comparison';
import { getQueryFromPool } from '#utils/db';
import { formatScopeType } from '#utils/format';
import { ScopeType } from '#utils/types';
import { formatFirstLetterToLowercase } from '#utils/utils';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.Subventions;
const COMMUNITIES_TABLE = DataTable.Communities;

function createSQLQueryParams(siren: string, scopeType: ScopeType): [string, (string | number)[]] {
  const values = [siren, siren, siren]; // We need siren multiple times

  let scopeCondition: string | null = '';
  if (scopeType === ScopeType.Region) {
    scopeCondition = 'code_insee_region';
  } else if (scopeType === ScopeType.Departement) {
    scopeCondition = 'code_insee_dept';
  } else {
    // For national, we don't filter by region/department
    scopeCondition = null;
  }

  // Generate exactly 8 years of data like marchés publics
  const querySQL = `
    WITH years AS (
      SELECT generate_series(
        EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER - 7,
        EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
      ) AS year
    ),
    community_data AS (
      SELECT 
        s.annee as year,
        SUM(s.montant) as community_amount
      FROM ${TABLE_NAME} s
      WHERE s.id_attribuant = $1
      AND s.annee IS NOT NULL
      AND s.montant IS NOT NULL
      AND s.annee >= EXTRACT(YEAR FROM CURRENT_DATE) - 7
      GROUP BY s.annee
    ),
    regional_data AS (
      SELECT 
        yearly_data.year,
        AVG(yearly_data.total_amount) as regional_avg_amount
      FROM (
        SELECT 
          s.annee as year,
          s.id_attribuant,
          SUM(s.montant) as total_amount
        FROM ${TABLE_NAME} s
        INNER JOIN ${COMMUNITIES_TABLE} c ON s.id_attribuant = c.siren
        WHERE s.annee IS NOT NULL
        AND s.montant IS NOT NULL  
        AND s.annee >= EXTRACT(YEAR FROM CURRENT_DATE) - 7
        AND c.type = (SELECT type FROM ${COMMUNITIES_TABLE} WHERE siren = $2)
        ${scopeCondition ? `AND c.${scopeCondition} = (SELECT ${scopeCondition} FROM ${COMMUNITIES_TABLE} WHERE siren = $3)` : ''}
        AND c.siren != $1
        GROUP BY s.annee, s.id_attribuant
      ) yearly_data
      GROUP BY yearly_data.year
    )
    SELECT 
      y.year::TEXT as year,
      cd.community_amount::BIGINT as community,
      rd.regional_avg_amount::BIGINT as regional,
      ci.nom as community_name,
      ci.type as community_type
    FROM years y
    LEFT JOIN community_data cd ON y.year = cd.year
    LEFT JOIN regional_data rd ON y.year = rd.year
    CROSS JOIN (
      SELECT nom, type FROM ${COMMUNITIES_TABLE} WHERE siren = $1
    ) ci
    ORDER BY y.year
  `;

  // Adjust values array based on whether we need the third parameter
  const finalValues = scopeCondition ? values : [siren, siren];

  return [querySQL, finalValues];
}

/**
 * Fetch subventions comparison data for a community (SSR)
 */
export async function fetchSubventionsComparison(
  siren: string,
  scopeType : ScopeType= ScopeType.Region,
): Promise<SubventionsComparisonData[]> {
  try {
    const params = createSQLQueryParams(siren, scopeType);
    const rows = (await getQueryFromPool(...params)) as Array<{
      year: string;
      community: number;
      regional: number;
      community_name: string;
      community_type: string;
    }>;

    if (!rows || rows.length === 0) return [];

    const communityName = rows[0].community_name;
    const communityLabel = `Budget de ${communityName}`;
    const regionalLabel = `Moyenne des budgets des collectivités ${formatFirstLetterToLowercase(formatScopeType(scopeType))}es`;

    return rows.map((row) => ({
      year: row.year,
      community: row.community || 0,
      communityLabel,
      regional: row.regional || 0,
      regionalLabel,
      communityMissing: row.community === null || row.community === undefined,
      regionalMissing: row.regional === null || row.regional === undefined,
    }));
  } catch (error) {
    console.error('Error fetching subventions comparison:', error);
    return [];
  }
}
