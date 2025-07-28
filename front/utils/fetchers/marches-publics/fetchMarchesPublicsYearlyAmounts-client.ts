import { YearlyAmount } from '#app/models/graphs';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
function getAPIRoute(communitySiren: string) {
  return `/api/communities/${communitySiren}/marches_publics/yearly_amounts`;
}

/**
 * Fetch the marches publics amounts for each year
 */
export async function fetchMarchesPublicsYearlyAmounts(
  communitySiren: string,
): Promise<YearlyAmount[]> {
  const url = new URL(getAPIRoute(communitySiren), baseURL);

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error('Failed to fetch marches publics yearly amounts with siren ' + communitySiren);
  }

  return (await res.json()) as Promise<YearlyAmount[]>;
}
