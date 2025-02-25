import { CommunitiesParamsOptions } from 'app/api/selected_communities/types';

export type Options = Omit<CommunitiesParamsOptions, 'limit'> & {
  limit?: number;
};

const DEFAULT_OPTIONS = {
  limit: 5000,
};

export async function fetchCommunities(options?: Options) {
  const limit = options?.limit ?? DEFAULT_OPTIONS.limit;
  const type = options?.type;

  const url = new URL('/api/selected_communities', window.location.host);

  if (type) url.searchParams.append('type', type);
  url.searchParams.append('limit', limit.toString());

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error('Failed to fetch communities');
  }

  return res.json();
}
