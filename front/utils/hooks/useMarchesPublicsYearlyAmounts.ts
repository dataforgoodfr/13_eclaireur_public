import { useQuery } from '@tanstack/react-query';

import { fetchMarchesPublicsYearlyAmounts } from '../fetchers/marches-publics/fetchMarchesPublicsYearlyAmounts-client';

export function useMarchesPublicsYearlyAmounts(siren: string) {
  const queryKey = ['communities', siren, 'marches-publics', 'yearly_amounts'];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchMarchesPublicsYearlyAmounts(siren),
  });

  return query;
}
