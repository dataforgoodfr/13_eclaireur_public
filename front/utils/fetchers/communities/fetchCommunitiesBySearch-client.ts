import { Community } from '@/app/models/community';

const API_ROUTE = '/api/communities_search';

/**
 * Fetch communities by query search using API routes
 * @param query
 * @returns
 */
export async function fetchCommunitiesBySearch(
  query: string,
  page = 1,
): Promise<Pick<Community, 'nom' | 'siren' | 'type' | 'code_postal'>[]> {
  const url = new URL(API_ROUTE, window.location.origin);

  url.searchParams.append('query', query);
  url.searchParams.append('page', page.toString());

  const res = await fetch(url.toString(), { method: 'GET' });

  if (!res.ok) {
    throw new Error('Failed to fetch communities with query ' + query);
  }

  return await res.json();
}