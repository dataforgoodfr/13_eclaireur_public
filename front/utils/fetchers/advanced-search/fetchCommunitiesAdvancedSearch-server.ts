import { AdvancedSearchCommunity, Community } from '@/app/models/community';
import { getQueryFromPool } from '@/utils/db';
import { CommunityType } from '@/utils/types';

import { DataTable } from '../constants';
import { stringifySelectors } from '../functions/stringifySelectors';
import { Pagination } from '../types';

type CurrentSelectors = 'type' | 'population' | 'mp_score' | 'subventions_score';

/**
 * Fetch the communities (SSR) by advanced search
 * @param filters
 * @returns
 */
export async function fetchCommunitiesAdvancedSearch(
  filters: CommunitiesAdvancedSearchFilters,
  pagination: Pagination,
): Promise<AdvancedSearchCommunity[]> {
  const params = createSQLQueryParams(filters, pagination);

  return getQueryFromPool(...params) as Promise<AdvancedSearchCommunity[]>;
}

const TABLE_NAME = DataTable.Communities;
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
 * Create the sql query for the marches publics
 * @param filters
 * @returns
 */
export function createSQLQueryParams(
  filters: CommunitiesAdvancedSearchFilters,
  pagination: Pagination,
) {
  const { type, population, mp_score, subventions_score } = filters;
  const { page, limit } = pagination;
  const values: (CommunityType | number | string | undefined)[] = [];

  const selectorsStringified = stringifySelectors(SELECTORS);
  let query = `
    SELECT ${selectorsStringified}, count(*) OVER()::real AS total_row_count
    FROM ${TABLE_NAME}
    `;

  let whereConditions = [];

  if (type) {
    whereConditions.push(`type = $${values.length + 1}`);
    values.push(type);
  }
  if (population) {
    whereConditions.push(`population <= $${values.length + 1}`);
    values.push(population);
  }
  if (mp_score) {
    whereConditions.push(`mp_score = $${values.length + 1}`);
    values.push(mp_score);
  }
  if (subventions_score) {
    whereConditions.push(`subventions_score = $${values.length + 1}`);
    values.push(subventions_score);
  }

  if (whereConditions.length > 0) {
    query += ` WHERE ${whereConditions.join(' AND ')}`;
  }

  query += ` LIMIT $${values.length + 1} OFFSET ($${values.length + 2} - 1) * $${values.length + 1}`;
  values.push(...[limit, page]);

  return [query, values] as const;
}
