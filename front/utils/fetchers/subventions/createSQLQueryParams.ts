import { Subvention } from '@/app/models/subvention';

import { CommunityType } from '../../types';
import { DataTable } from '../constants';
import { stringifySelectors } from '../functions/stringifySelectors';

export type SubventionsParams = {
  selectors?: (keyof Subvention)[];
  filters?: Partial<Subvention>;
  limit?: number;
  orderBy?: { direction: 'asc' | 'desc'; column: keyof Subvention };
};

const TABLE_NAME = DataTable.Subventions;

/**
 * Create the sql query for the subventions
 * @param options
 * @returns
 */
export function createSQLQueryParams(options?: SubventionsParams) {
  let values: (CommunityType | number | string | boolean)[] = [];

  const selectorsStringified = stringifySelectors(options?.selectors);
  let query = `SELECT ${selectorsStringified} FROM ${TABLE_NAME}`;

  if (options === undefined) {
    return [query, values] as const;
  }

  const { filters, limit, orderBy } = options;

  const whereConditions: string[] = [];

  const keys = filters && (Object.keys(filters) as unknown as (keyof typeof filters)[]);

  keys?.forEach((key) => {
    const option = filters?.[key];
    if (option == null) {
      throw new Error(
        `${key} with value ${option} is null or undefined and blocks the query ${query}`,
      );
    }

    whereConditions.push(`${key} = $${values.length + 1}`);
    values.push(option);
  });

  if (whereConditions.length > 0) {
    query += ` WHERE ${whereConditions.join(' AND ')}`;
  }

  if (orderBy) {
    query += ` ORDER BY $${values.length + 1} $${values.length + 2}`;
    values.push(...[orderBy.column, orderBy.direction]);
  }

  if (limit) {
    query += ` LIMIT $${values.length + 1}`;
    values.push(limit);
  }

  return [query, values] as const;
}
