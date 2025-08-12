import { Community } from '#app/models/community';

import { Pagination } from '../types';
import { CommunitiesOptions } from './createSQLQueryParams';

const API_ROUTE = '/api/selected_communities';

/**
 * Fetch communities using API routes
 * @param options
 * @returns
 */
export async function fetchCommunities(
  options?: CommunitiesOptions,
  pagination?: Pagination,
): Promise<Community[]> {
  const url = new URL(API_ROUTE, window.location.origin);
  console.log(url.toString());
  const limit = options?.limit;
  const siren = options?.filters?.siren;
  const type = options?.filters?.type;

  if (siren) url.searchParams.append('siren', siren);
  if (type) url.searchParams.append('type', type);
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