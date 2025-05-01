import { YearlyCount } from '@/app/models/graphs';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
function getAPIRoute(communitySiren: string) {
  return `/api/communities/${communitySiren}/subventions/yearly_counts`;
}

/**
 * Fetch the subvention counts for each year
 */
export async function fetchSubventionYearlyCounts(communitySiren: string): Promise<YearlyCount[]> {
  const url = new URL(getAPIRoute(communitySiren), baseURL);

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error('Failed to fetch subvention yearly counts with siren ' + communitySiren);
  }

  return (await res.json()) as Promise<YearlyCount[]>;
}
