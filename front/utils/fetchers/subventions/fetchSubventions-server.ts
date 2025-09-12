import { Subvention } from '#app/models/subvention';
import { getQueryFromPool } from '#utils/db';

import { SubventionsParams, createSQLQueryParams } from './createSQLQueryParams';

/**
 * Fetch the subventions (SSR) with options/filters
 * @param options
 * @returns
 */
export async function fetchSubventions(options?: SubventionsParams): Promise<Subvention[]> {
  const params = createSQLQueryParams(options);

  return getQueryFromPool(...params) as Promise<Subvention[]>;
}
