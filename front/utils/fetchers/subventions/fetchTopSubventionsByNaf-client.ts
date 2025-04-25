import { SubventionSector } from '@/app/models/subvention';

import { Pagination } from '../types';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const API_ROUTE = '/api/subventions/top/sector';

/**
 * Fetch the top subventions by section naf with pagination
 * @param query
 * @param limit
 */
export async function fetchTopSubventionsByNaf(
  siren: string,
  year: number | null,
  pagination: Pagination,
): Promise<SubventionSector[]> {
  const url = new URL(API_ROUTE, baseURL);

  url.searchParams.append('siren', siren);

  if (year !== null) url.searchParams.append('year', year.toString());

  const { page, limit } = pagination;
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error('Failed to fetch top with siren ' + siren);
  }

  return (await res.json()) as Promise<SubventionSector[]>;
}
