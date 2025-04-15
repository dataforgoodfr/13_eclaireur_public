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
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const url = new URL(API_ROUTE, baseURL);

  url.searchParams.append('query', query);
  url.searchParams.append('page', page.toString());

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error('Failed to fetch communities with query ' + query);
  }

  return (await res.json()) as Promise<Pick<Community, 'nom' | 'siren' | 'type' | 'code_postal'>[]>;
}
