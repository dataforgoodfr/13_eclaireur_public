import { CommunitiesParamsOptions } from 'app/api/selected_communities/types';

export type Options = Omit<CommunitiesParamsOptions, 'limit'> & {
  limit?: number;
};

export async function fetchCommunities(options?: Options) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const limit = options?.limit;
  const type = options?.type;

  const url = new URL('/api/selected_communities', baseURL);
  if (type) url.searchParams.append('type', type);
  if (limit) url.searchParams.append('limit', limit.toString());

  const res = await fetch(url.toString(), { method: 'get' });

  if (!res.ok) {
    throw new Error('Failed to fetch communities');
  }

  return res.json();
}
