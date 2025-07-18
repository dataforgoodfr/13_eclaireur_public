import { Bareme } from '@/app/models/bareme';

function getAPIRoute(siren: string) {
  return `/api/communities/${siren}/transparency-score`;
}

/**
 * Fetch the transparency score of a community for a given year
 */
export async function fetchTransparencyScore(siren: string, year: number): Promise<Bareme> {
  const url = new URL(getAPIRoute(siren), window.location.origin);
  url.searchParams.append('year', year.toString());

  const res = await fetch(url.toString(), { method: 'GET' });

  if (!res.ok) {
    throw new Error(`Failed to fetch transparency score with siren ${siren} and year ${year}`);
  }

  return await res.json();
}