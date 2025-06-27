import { ComparisonType } from '@/app/community/[siren]/comparison/[comparedSiren]/components/ComparisonType';
import { MPSubvComparison } from '@/app/models/comparison';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
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
  const url = new URL(getAPIRoute(siren), baseURL);
  url.searchParams.append('year', year.toString());
  url.searchParams.append('comparisonType', comparisonType.toString());

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch transparency score with siren ${siren}, year ${year} and comparisonType ${comparisonType}`,
    );
  }

  return (await res.json()) as Promise<MPSubvComparison>;
}
