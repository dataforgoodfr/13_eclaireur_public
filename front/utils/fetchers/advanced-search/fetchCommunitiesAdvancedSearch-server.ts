import { AdvancedSearchOrder } from '#app/advanced-search/hooks/useOrderParams';
import { AdvancedSearchCommunity, Community } from '#app/models/community';
import { getQueryFromPool } from '#utils/db';
import { CommunityType } from '#utils/types';

import { DataTable } from '../constants';
import { stringifySelectors } from '../functions/stringifySelectors';
import { Pagination } from '../types';

/**
 * Fetch the communities (SSR) by advanced search
 * @param filters
 * @returns
 */
export async function fetchCommunitiesAdvancedSearch(
  filters: CommunitiesAdvancedSearchFilters,
  pagination: Pagination,
  order: AdvancedSearchOrder,
): Promise<AdvancedSearchCommunity[]> {
  const params = createSQLQueryParams(filters, pagination, order);

  return getQueryFromPool(...params) as Promise<AdvancedSearchCommunity[]>;
}

const COMMUNITIES = DataTable.Communities;
const BAREME = DataTable.Bareme;

const SELECTORS = [
  'siren',
  'nom',
  'type',
  'population',
  'mp_score',
  'subventions_score',
] satisfies (keyof Community)[];

export type CommunitiesAdvancedSearchFilters = Partial<
  Pick<Community, 'type' | 'population' | 'mp_score' | 'subventions_score'>
>;


/**
 * Create the sql query for the advanced search
 */
export function createSQLQueryParams(
  filters: CommunitiesAdvancedSearchFilters,
  pagination: Pagination,
  order: AdvancedSearchOrder,
) {
  const { type, population, mp_score, subventions_score } = filters;
  const { page, limit } = pagination;
  const { by, direction } = order;
  const values: (CommunityType | number | string | undefined)[] = [];

  const baseSelectors = SELECTORS.filter(s => s !== 'mp_score' && s !== 'subventions_score');
  const selectorsStringified = stringifySelectors(baseSelectors, 'c');
  
  // Use the most recent year available in the bareme table (2024)
  const recentYear = 2024;
  
  let query = `
    SELECT ${selectorsStringified},
      b.mp_score,
      b.subventions_score,
      b.annee, 
      NULL as subventions_budget,
      count(*) OVER()::real AS total_row_count
    FROM ${COMMUNITIES} c
    LEFT JOIN ${BAREME} b ON c.siren = b.siren AND b.annee = $${values.length + 1}
    WHERE c.nom IS NOT NULL
    `;
  
  values.push(recentYear);

  let additionalConditions = [];

  if (type) {
    additionalConditions.push(`c.type = $${values.length + 1}`);
    values.push(type);
  }
  if (population) {
    additionalConditions.push(`c.population <= $${values.length + 1}`);
    values.push(population);
  }
  if (mp_score) {
    additionalConditions.push(`b.mp_score = $${values.length + 1}`);
    values.push(mp_score);
  }
  if (subventions_score) {
    additionalConditions.push(`b.subventions_score = $${values.length + 1}`);
    values.push(subventions_score);
  }

  if (additionalConditions.length > 0) {
    query += ` AND ${additionalConditions.join(' AND ')}`;
  }

  // Map order by fields to correct aliases
  const orderByMapping: Record<string, string> = {
    'nom': 'c.nom',
    'type': 'c.type', 
    'population': 'c.population',
    'mp_score': 'b.mp_score',
    'subventions_score': 'b.subventions_score',
    'annee': 'b.annee'
  };
  
  const orderByField = orderByMapping[by] || `c.${by}`;
  query += ` ORDER BY ${orderByField} ${direction}`;

  query += ` LIMIT $${values.length + 1} OFFSET ($${values.length + 2} - 1) * $${values.length + 1}`;
  values.push(...[limit, page]);

  return [query, values] as const;
}
