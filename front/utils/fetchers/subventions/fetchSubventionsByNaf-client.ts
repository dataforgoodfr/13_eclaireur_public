import { SubventionSector } from '#app/models/subvention';

import { Pagination } from '../types';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
function getAPIRoute(communitySiren: string) {
  return `/api/communities/${communitySiren}/subventions/by_naf2`;
}

/**
 * Fetch the subventions by section naf with pagination
 * @param query
 * @param limit
 */
export async function fetchSubventionsByNaf(
  communitySiren: string,
  year: number | null,
  pagination: Pagination,
  maxAmount: number | null,
): Promise<SubventionSector[]> {
  const url = new URL(getAPIRoute(communitySiren), baseURL);

  if (year !== null) url.searchParams.append('year', year.toString());
  if (maxAmount !== null) url.searchParams.append('maxAmount', maxAmount.toString());

  const { page, limit } = pagination;
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error('Failed to fetch subventions by naf with siren ' + communitySiren);
  }

  return (await res.json()) as Promise<SubventionSector[]>;
}
