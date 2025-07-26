import { useQuery } from '@tanstack/react-query';

import { fetchCommunitiesBySearch } from '../fetchers/communities/fetchCommunitiesBySearch-client';

export function useCommunitiesBySearch(query: string, page?: number) {
  const queryKey = ['communities', query, page];

  const queryResult = useQuery({
    queryKey,
    queryFn: () => fetchCommunitiesBySearch(query, page),
  });

  return queryResult;
}
