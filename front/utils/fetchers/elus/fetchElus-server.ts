import { Elu } from '@/app/models/elu';
import { getQueryFromPool } from '@/utils/db';

import { Pagination } from '../types';
import { ElusOptions, createSQLQueryParams } from './createSQLQueryParams';

/**
 * Fetch the elus (SSR) with options/filters
 * @param filters
 * @returns
 */
export async function fetchElus(options?: ElusOptions, pagination?: Pagination): Promise<Elu[]> {
  const params = createSQLQueryParams(options, pagination);

  return getQueryFromPool(...params) as Promise<Elu[]>;
}
