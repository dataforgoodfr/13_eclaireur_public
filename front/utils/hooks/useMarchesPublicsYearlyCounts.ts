import { useQuery } from '@tanstack/react-query';

import { fetchMarchesPublicsYearlyCounts } from '../fetchers/marches-publics/fetchMarchesPublicsYearlyCounts-client';

export function useMarchesPublicsYearlyCounts(siren: string) {
  const queryKey = ['communities', siren, 'marches-publics', 'yearly_counts'];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchMarchesPublicsYearlyCounts(siren),
  });

  return query;
}
