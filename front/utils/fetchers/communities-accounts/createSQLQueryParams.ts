import { Community } from '#app/models/community';

import { CommunityType } from '../../types';
import { DataTable } from '../constants';
import { stringifySelectors } from '../functions/stringifySelectors';
import { Pagination } from '../types';

export type CommunitiesAccountsOptions = {
  selectors?: (keyof Community)[];
  filters?: Partial<Pick<Community, 'siren' | 'type'>>;
  limit?: number;
};

const TABLE_NAME = DataTable.CommunitiesAccount;

/**
 * Create the sql query for the marches publics
 * @param options
 * @returns
 */
export function createSQLQueryParams(
  options?: CommunitiesAccountsOptions,
  pagination?: Pagination,
) {
  let values: (CommunityType | number | string)[] = [];

  const selectorsStringified = stringifySelectors(options?.selectors);
  let query = `
    SELECT ${selectorsStringified}, count(*) OVER() AS full_count
    FROM ${TABLE_NAME}
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

    whereConditions.push(`${key} = $${values.length + 1}`);
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
