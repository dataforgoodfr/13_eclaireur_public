import { getServerBaseURL } from '../getHostURL';

export default async function fetchCommunityBySiren(siren: string) {
  const baseURL = getServerBaseURL();

  const url = new URL(`/api/selected_communities?siren=${siren}&limit=1`, baseURL);

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Failed to fetch community: ${res.status} ${res.statusText}`);
  }

  const community = await res.json();

  return community[0];
}
