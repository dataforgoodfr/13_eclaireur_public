import { fetchTransparencyScore } from '@/utils/fetchers/communities/fetchTransparencyScore-client';
import { useQuery } from '@tanstack/react-query';

export function useTransparencyScore(siren: string, year: number) {
  const queryKey = ['TransparencyScore', siren, year];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchTransparencyScore(siren, year),
  });

  return query;
}
