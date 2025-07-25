import { MarchePublicSector } from '@/app/models/marchePublic';

import { Pagination } from '../types';

function getAPIRoute(communitySiren: string) {
  return `/api/communities/${communitySiren}/marches_publics/by_cpv_2`;
}

/**
 * Fetch the top marches publics by sector with pagination
 * @param query
 * @param limit
 */
export async function fetchMarchesPublicsByCPV2(
  communitySiren: string,
  year: number | null,
  pagination: Pagination,
  maxAmount: number | null,
): Promise<MarchePublicSector[]> {
  const url = new URL(getAPIRoute(communitySiren), window.location.origin);

  if (year !== null) url.searchParams.append('year', year.toString());
  if (maxAmount !== null) url.searchParams.append('maxAmount', maxAmount.toString());

  const { page, limit } = pagination;
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());

  const res = await fetch(url.toString(), { method: 'GET' });

  if (!res.ok) {
    throw new Error('Failed to fetch mp by cpv2 with siren ' + communitySiren);
  }

  return await res.json();
}