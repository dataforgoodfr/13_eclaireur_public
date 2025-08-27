import { SubventionsComparisonData } from '#app/models/comparison';
import { getQueryFromPool } from '#utils/db';

import { DataTable } from '../constants';

const TABLE_NAME = DataTable.Subventions;
const COMMUNITIES_TABLE = DataTable.Communities;

function createSQLQueryParams(siren: string, scope: string): [string, (string | number)[]] {
  const values = [siren, siren, siren]; // We need siren multiple times
  
  // Build scope condition dynamically - handle both French and English scope names
  let scopeCondition: string | null = '';
  const normalizedScope = scope.toLowerCase();
  if (normalizedScope === 'régional' || normalizedScope === 'regional') {
    scopeCondition = 'code_insee_region';
  } else if (normalizedScope === 'départemental' || normalizedScope === 'departmental') {
    scopeCondition = 'code_insee_departement'; 
  } else {
    // For national, we don't filter by region/department
    scopeCondition = null;
  }

  // Simplified query similar to the Python script structure
  const querySQL = `
    SELECT 
      cd.year::TEXT as year,
      cd.community_amount::BIGINT as community,
      COALESCE(rd.regional_avg_amount, 0)::BIGINT as regional,
      ci.nom as community_name,
      ci.type as community_type
    FROM (
      -- Community data
      SELECT 
        s.annee_subvention as year,
        SUM(s.montant) as community_amount
      FROM ${TABLE_NAME} s
      WHERE s.id_attribuant = $1
      AND s.annee_subvention IS NOT NULL
      AND s.montant IS NOT NULL
      AND s.annee_subvention >= 2018
      GROUP BY s.annee_subvention
    ) cd
    LEFT JOIN (
      -- Regional averages
      SELECT 
        yearly_data.year,
        AVG(yearly_data.total_amount) as regional_avg_amount
      FROM (
        SELECT 
          s.annee_subvention as year,
          s.id_attribuant,
          SUM(s.montant) as total_amount
        FROM ${TABLE_NAME} s
        INNER JOIN ${COMMUNITIES_TABLE} c ON s.id_attribuant = c.siren
        WHERE s.annee_subvention IS NOT NULL
        AND s.montant IS NOT NULL  
        AND s.annee_subvention >= 2018
        AND c.type = (SELECT type FROM ${COMMUNITIES_TABLE} WHERE siren = $2)
        ${scopeCondition ? `AND c.${scopeCondition} = (SELECT ${scopeCondition} FROM ${COMMUNITIES_TABLE} WHERE siren = $3)` : ''}
        AND c.siren != $1
        GROUP BY s.annee_subvention, s.id_attribuant
      ) yearly_data
      GROUP BY yearly_data.year
    ) rd ON cd.year = rd.year
    CROSS JOIN (
      SELECT nom, type FROM ${COMMUNITIES_TABLE} WHERE siren = $1
    ) ci
    ORDER BY cd.year
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
  scope: string = 'régional'
): Promise<SubventionsComparisonData[]> {
  try {
    const params = createSQLQueryParams(siren, scope);
    const rows = (await getQueryFromPool(...params)) as Array<{
      year: string;
      community: number;
      regional: number;
      community_name: string;
      community_type: string;
    }>;

    if (!rows || rows.length === 0) return [];

    const communityName = rows[0].community_name;
    const communityType = rows[0].community_type;
    
    const communityLabel = `Budget de ${communityName}`;
    
    // Generate proper French labels
    const normalizedScope = scope.toLowerCase();
    let scopeLabel = '';
    if (normalizedScope === 'régional' || normalizedScope === 'regional') {
      scopeLabel = 'régionale';
    } else if (normalizedScope === 'départemental' || normalizedScope === 'departmental') {
      scopeLabel = 'départementale';
    } else {
      scopeLabel = 'nationale';
    }
    
    const regionalLabel = `Moyenne ${scopeLabel} des collectivités ${communityType.toLowerCase()}s`;

    return rows.map(row => ({
      year: row.year,
      community: row.community,
      communityLabel,
      regional: row.regional,
      regionalLabel,
    }));
  } catch (error) {
    console.error('Error fetching subventions comparison:', error);
    return [];
  }
}