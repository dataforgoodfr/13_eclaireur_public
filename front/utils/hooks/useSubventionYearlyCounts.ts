import { useQuery } from '@tanstack/react-query';

import { fetchSubventionYearlyCounts } from '../fetchers/subventions/fetchSubventionYearlyCounts-client';

export function useSubventionYearlyCounts(siren: string) {
  const queryKey = ['communities', siren, 'subventions', 'yearly_counts'];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchSubventionYearlyCounts(siren),
  });

  return query;
}
