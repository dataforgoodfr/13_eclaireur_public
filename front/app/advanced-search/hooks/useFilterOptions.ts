import { useQuery } from '@tanstack/react-query';

import { CommunityType } from '#utils/types';

interface FilterOptions {
  types: CommunityType[];
  populations: number[];
  mpScores: string[];
  subventionsScores: string[];
}

interface UseFilterOptionsParams {
  type?: CommunityType | null;
  population?: number | null;
  mp_score?: string | null;
  subventions_score?: string | null;
}

export function useFilterOptions(filters: UseFilterOptionsParams) {
  return useQuery<FilterOptions>({
    queryKey: ['filter-options', filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (filters.type) searchParams.set('type', filters.type);
      if (filters.population) searchParams.set('population', filters.population.toString());
      if (filters.mp_score) searchParams.set('mp_score', filters.mp_score);
      if (filters.subventions_score) searchParams.set('subventions_score', filters.subventions_score);

      const response = await fetch(`/api/advanced-search/filter-options?${searchParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch filter options');
      }
      return response.json();
    },
  });
}