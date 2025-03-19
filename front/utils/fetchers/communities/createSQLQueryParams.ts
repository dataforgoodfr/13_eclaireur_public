import { Community } from '@/app/models/community';

import { CommunityType } from '../../types';
import { DataTable } from '../constants';

export type CommunitiesOptions = {
  selectors?: (keyof Community)[];
  filters?: Partial<Pick<Community, 'siren' | 'type'>> & {
    limit?: number;
  };
};

const TABLE_NAME = DataTable.Communities;

function stringifySelectors(options: CommunitiesOptions): string {
  const { selectors } = options;

  if (selectors == null) {
    return '*';
  }

  return selectors.join(', ');
}

/**
 * Create the sql query for the marches publics
 * @param options
 * @returns
 */
export function createSQLQueryParams(options?: CommunitiesOptions) {
  let values: (CommunityType | number | string)[] = [];

  if (options === undefined) {
    return [`SELECT * FROM ${TABLE_NAME}`, values] as const;
  }

  const selectorsStringified = stringifySelectors(options);
  let query = `SELECT ${selectorsStringified} FROM ${TABLE_NAME}`;

  const { filters } = options;

  const { limit, ...restFilters } = filters ?? { limit: undefined };

  const whereConditions: string[] = [];

  const keys = Object.keys(restFilters) as unknown as (keyof typeof filters)[];

  keys.forEach((key) => {
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

  if (limit) {
    query += ` LIMIT $${values.length + 1}`;
    values.push(limit);
  }

  return [query, values] as const;
}
