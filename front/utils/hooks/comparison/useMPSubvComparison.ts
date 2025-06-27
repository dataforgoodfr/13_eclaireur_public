import { ComparisonType } from '@/app/community/[siren]/comparison/[comparedSiren]/components/ComparisonType';
import { fetchMPSubvComparison } from '@/utils/fetchers/communities/fetchMPSubvComparison-client';
import { useQuery } from '@tanstack/react-query';

export function useMPSubvComparison(siren: string, year: number, comparisonType: ComparisonType) {
  const queryKey = ['MPSubvComparison', siren, year, comparisonType];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchMPSubvComparison(siren, year, comparisonType),
  });

  return query;
}
