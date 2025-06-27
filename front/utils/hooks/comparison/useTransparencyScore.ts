import { useQuery } from '@tanstack/react-query';

import { fetchTransparencyScore } from '@/utils/fetchers/communities/fetchTransparencyScore-client';

export function useTransparencyScore(siren: string, year: number) {
  const queryKey = ['TransparencyScore', siren, year];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchTransparencyScore(siren, year),
  });

  return query;
}
