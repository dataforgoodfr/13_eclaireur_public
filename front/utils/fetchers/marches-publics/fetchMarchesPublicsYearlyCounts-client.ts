import { YearlyCount } from '@/app/models/graphs';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
function getAPIRoute(communitySiren: string) {
  return `/api/communities/${communitySiren}/marches_publics/yearly_counts`;
}

/**
 * Fetch the marches publics counts for each year
 */
export async function fetchMarchesPublicsYearlyCounts(communitySiren: string): Promise<YearlyCount[]> {
  const url = new URL(getAPIRoute(communitySiren), baseURL);

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error('Failed to fetch marches publics yearly counts with siren ' + communitySiren);
  }

  return (await res.json()) as Promise<YearlyCount[]>;
}
