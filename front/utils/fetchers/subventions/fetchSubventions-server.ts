import { SubventionV0 } from '@/app/models/subvention';
import { getQueryFromPool } from '@/utils/db';

import { SubventionsParams, createSQLQueryParams } from './createSQLQueryParams';

/**
 * Fetch the subventions (SSR) with options/filters
 * @param options
 * @returns
 */
export async function fetchSubventions(options?: SubventionsParams): Promise<SubventionV0[]> {
  const params = createSQLQueryParams(options);

  return getQueryFromPool(...params) as Promise<SubventionV0[]>;
}
