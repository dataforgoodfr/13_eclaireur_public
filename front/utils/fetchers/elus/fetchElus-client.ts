import type { Elu } from '#app/models/elu';

import type { Pagination } from '../types';
import type { ElusOptions } from './createSQLQueryParams';

const API_ROUTE = '/api/selected_communities';

/**
 * Fetch elus using API routes
 * @param options
 * @returns
 */
export async function fetchElus(options?: ElusOptions, pagination?: Pagination): Promise<Elu[]> {
  const limit = options?.limit;
  const siren = options?.filters?.siren;

  const url = new URL(API_ROUTE, window.location.origin);

  if (siren) url.searchParams.append('siren', siren);
  if (!pagination && limit) url.searchParams.append('limit', limit.toString());
  if (pagination) {
    url.searchParams.append('page', pagination.page.toString());
    url.searchParams.append('limit', pagination.limit.toString());
  }

  const res = await fetch(url.toString(), { method: 'GET' });

  if (!res.ok) {
    throw new Error('Failed to fetch communities');
  }

  return await res.json();
}
