import { Community } from '@/app/models/community';

import { CommunitiesOptions } from './createSQLQueryParams';

const API_ROUTE = '/api/selected_communities';

/**
 * Fetch communities using API routes
 * @param options
 * @returns
 */
export async function fetchCommunities(options?: CommunitiesOptions): Promise<Community[]> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const limit = options?.filters?.limit;
  const type = options?.filters?.type;

  const url = new URL(API_ROUTE, baseURL);

  if (type) url.searchParams.append('type', type);
  if (limit) url.searchParams.append('limit', limit.toString());

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error('Failed to fetch communities');
  }

  return (await res.json()) as Promise<Community[]>;
}
