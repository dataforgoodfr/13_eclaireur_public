import { YearlyAmount } from '#app/models/graphs';

function getAPIRoute(communitySiren: string) {
  return `/api/communities/${communitySiren}/marches_publics/yearly_amounts`;
}

/**
 * Fetch the marches publics amounts for each year
 */
export async function fetchMarchesPublicsYearlyAmounts(
  communitySiren: string,
): Promise<YearlyAmount[]> {
  const url = new URL(getAPIRoute(communitySiren), window.location.origin);

  const res = await fetch(url.toString(), { method: 'GET' });

  if (!res.ok) {
    throw new Error('Failed to fetch marches publics yearly amounts with siren ' + communitySiren);
  }

  return await res.json();
}
