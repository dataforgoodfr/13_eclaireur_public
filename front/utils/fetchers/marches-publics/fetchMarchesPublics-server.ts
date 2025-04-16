import { MarchePublic } from '@/app/models/marchePublic';
import { getQueryFromPool } from '@/utils/db';

import { MarchesPublicsParams, createSQLQueryParams } from './createSQLQueryParams';

/**
 * Fetch the marches publics (SSR) with options/filters
 * @param options
 * @returns
 */
export async function fetchMarchesPublics(options?: MarchesPublicsParams): Promise<MarchePublic[]> {
  const params = createSQLQueryParams(options);

  return getQueryFromPool(...params) as Promise<MarchePublic[]>;
}
