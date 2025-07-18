import { Bareme } from '@/app/models/bareme';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
function getAPIRoute(siren: string) {
  return `/api/communities/${siren}/transparency-score`;
}

/**
 * Fetch the transparency score of a community for a given year
 */
export async function fetchTransparencyScore(siren: string, year: number): Promise<Bareme> {
  const url = new URL(getAPIRoute(siren), baseURL);
  url.searchParams.append('year', year.toString());

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error(`Failed to fetch transparency score with siren ${siren} and year ${year}`);
  }

  return (await res.json()) as Promise<Bareme>;
}
