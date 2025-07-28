import { YearlyCount } from '#app/models/graphs';
import { getBaseUrl } from '#utils/baseUrl';

function getAPIRoute(communitySiren: string) {
  return `/api/communities/${communitySiren}/marches_publics/yearly_counts`;
}

/**
 * Fetch the marches publics counts for each year
 */
export async function fetchMarchesPublicsYearlyCounts(
  communitySiren: string,
): Promise<YearlyCount[]> {
  const baseUrl = getBaseUrl();
  const url = new URL(getAPIRoute(communitySiren), baseUrl);
  console.log('[fetchMarchesPublicsYearlyCounts] Making request to:', url.toString());

  const res = await fetch(url.toString(), { method: 'GET' });

  if (!res.ok) {
    throw new Error('Failed to fetch marches publics yearly counts with siren ' + communitySiren);
  }

  return await res.json();
}