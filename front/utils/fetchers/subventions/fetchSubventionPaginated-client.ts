import { Subvention, PaginatedSubvention } from '#app/models/subvention';

import { Pagination } from '../types';

function getAPIRoute(communitySiren: string) {
  return `/api/communities/${communitySiren}/subventions/paginated`;
}

const DEFAULT_BY: keyof Subvention = 'montant';

/**
 * Fetch the top marches publics by amount with pagination
 * Default by montant
 */
export async function fetchSubventionPaginated(
  communitySiren: string,
  year: number | null,
  pagination: Pagination,
  by = DEFAULT_BY,
): Promise<PaginatedSubvention[]> {
  const url = new URL(getAPIRoute(communitySiren), window.location.origin);

  if (year !== null) url.searchParams.append('year', year.toString());

  url.searchParams.append('by', by.toString());

  const { page, limit } = pagination;
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());

  const res = await fetch(url.toString(), { method: 'GET' });

  if (!res.ok) {
    throw new Error('Failed to fetch mp by amount with siren ' + communitySiren);
  }

  return await res.json();
}