import { Community } from '#app/models/community';

import { CommunityType } from '../../types';
import { DataTable } from '../constants';
import { stringifySelectors } from '../functions/stringifySelectors';
import { Pagination } from '../types';

export type CommunitiesOptions = {
  selectors?: (keyof Community)[];
  filters?: Partial<Pick<Community, 'siren' | 'type'>>;
  limit?: number;
};

const TABLE_NAME = DataTable.Communities;

/**
 * Create the sql query for the marches publics
 * @param options
 * @returns
 */
export function createSQLQueryParams(options?: CommunitiesOptions, pagination?: Pagination) {
  let values: (CommunityType | number | string)[] = [];

  const selectorsStringified = stringifySelectors(options?.selectors, 'c');
  let query = `
    SELECT 
      ${selectorsStringified},
      b.subventions_score,
      b.mp_score,
      cc.nom_dept as nom_departement,
      count(c.*) OVER() AS full_count
    FROM ${TABLE_NAME} c
    LEFT JOIN bareme b ON c.siren = b.siren AND b.annee = 2024
    LEFT JOIN comptes_collectivites cc ON c.siren = cc.siren
   `;

  if (options === undefined) {
    return [query, values] as const;
  }

  const { filters, limit } = options;

  const whereConditions: string[] = [];

  const keys = filters && (Object.keys(filters) as unknown as (keyof typeof filters)[]);

  keys?.forEach((key) => {
    const option = filters?.[key];
    if (option == null) {
      console.error(`${key} with value is null or undefined in the query ${query}`);

      return;
    }

    whereConditions.push(`c.${key} = $${values.length + 1}`);
    values.push(option);
  });

  if (whereConditions.length > 0) {
    query += ` WHERE ${whereConditions.join(' AND ')}`;
  }

  if (limit && !pagination) {
    query += ` LIMIT $${values.length + 1}`;
    values.push(limit);
  }

  if (pagination) {
    query += ` LIMIT $${values.length + 1} OFFSET ($${values.length + 2} - 1) * $${values.length + 1};`;
    values.push(...[pagination.limit, pagination.page]);
  }

  return [query, values] as const;
}
