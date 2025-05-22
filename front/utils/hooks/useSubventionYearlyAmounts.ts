import { useQuery } from '@tanstack/react-query';

import { fetchSubventionYearlyAmounts } from '../fetchers/subventions/fetchSubventionYearlyAmounts-client';

export function useSubventionYearlyAmounts(siren: string) {
  const queryKey = ['communities', siren, 'subventions', 'yearly_amounts'];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchSubventionYearlyAmounts(siren),
  });

  return query;
}
