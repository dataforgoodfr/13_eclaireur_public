import { CommunityTopoJSON } from '../types';

export async function fetchGeoCommunities(): Promise<CommunityTopoJSON> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const url = new URL('/api/geojson_communities', baseURL);

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error('Failed to fetch geo communities');
  }

  return res.json() as Promise<CommunityTopoJSON>;
}
