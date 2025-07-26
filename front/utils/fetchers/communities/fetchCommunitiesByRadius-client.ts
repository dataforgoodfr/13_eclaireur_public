import { Community } from '#app/models/community';

const API_ROUTE = '/api/communities_search';

/**
 * Fetch communities by query search using API routes
 * @param query
 * @returns
 */
export async function fetchCommunitiesByRadius(
  latitude: number,
  longitude: number,
  radius: number,
): Promise<Pick<Community, 'nom' | 'siren' | 'type'>[]> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const url = new URL(API_ROUTE, baseURL);

  url.searchParams.append('latitude', latitude.toString());
  url.searchParams.append('longitude', longitude.toString());
  url.searchParams.append('radius', radius.toString());

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error('Failed to fetch communities by radius ' + radius);
  }

  return (await res.json()) as Promise<Pick<Community, 'nom' | 'siren' | 'type'>[]>;
}
