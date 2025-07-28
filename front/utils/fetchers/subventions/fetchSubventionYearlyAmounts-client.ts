import { YearlyAmount } from '#app/models/graphs';

function getAPIRoute(communitySiren: string) {
  return `/api/communities/${communitySiren}/subventions/yearly_amounts`;
}

/**
 * Fetch the subvention amounts for each year
 */
export async function fetchSubventionYearlyAmounts(
  communitySiren: string,
): Promise<YearlyAmount[]> {
  const url = new URL(getAPIRoute(communitySiren), window.location.origin);

  const res = await fetch(url.toString(), { method: 'GET' });

  if (!res.ok) {
    throw new Error('Failed to fetch subvention yearly amounts with siren ' + communitySiren);
  }

  return await res.json();
}