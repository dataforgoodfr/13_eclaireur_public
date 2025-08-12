import { ComparisonType } from '#app/community/[siren]/comparison/[comparedSiren]/components/ComparisonType';
import { MPSubvComparison } from '#app/models/comparison';

function getAPIRoute(siren: string) {
  return `/api/communities/${siren}/mp-subv-comparison`;
}

/**
 * Fetch the data to compare the Marches Publics or Subventions of a community
 */
export async function fetchMPSubvComparison(
  siren: string,
  year: number,
  comparisonType: ComparisonType,
): Promise<MPSubvComparison> {
  const url = new URL(getAPIRoute(siren), window.location.origin);
  url.searchParams.append('year', year.toString());
  url.searchParams.append('comparisonType', comparisonType.toString());

  const res = await fetch(url.toString(), { method: 'GET' });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch transparency score with siren ${siren}, year ${year} and comparisonType ${comparisonType}`,
    );
  }

  return await res.json();
}