import { MarchePublicSector } from '@/app/models/marchePublic';

const ROWS_PER_PAGE = 20;

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const API_ROUTE = '/api/marches_publics/top/sector';

/**
 * Fetch the top marches publics by sector with pagination
 * @param query
 * @param limit
 */
export async function fetchTopMarchesPublicsBySector(
  siren: string,
  year: number | null,
  limit = ROWS_PER_PAGE,
): Promise<MarchePublicSector[]> {
  const url = new URL(API_ROUTE, baseURL);

  url.searchParams.append('siren', siren);
  if (year !== null) url.searchParams.append('year', year.toString());
  url.searchParams.append('limit', limit.toString());

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error('Failed to fetch top with siren ' + siren);
  }

  return (await res.json()) as Promise<MarchePublicSector[]>;
}
