import { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Community } from '@/app/models/community';
import { TransparencyScore } from '@/components/TransparencyScore/constants';
import { CommunityType } from '@/utils/types';
import { parseNumber } from '@/utils/utils';

import { DEFAULT_PAGE } from './usePaginationParams';

type Filters = Partial<Pick<Community, 'type' | 'population' | 'mp_score' | 'subventions_score'>>;

type ReturnType = {
  filters: Filters;
  setFilter: (key: string, value: string | null) => void;
};

export function useFiltersParams(): ReturnType {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const newParams = new URLSearchParams(searchParams);

      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }

      newParams.set('page', DEFAULT_PAGE.toString());

      router.push(`${pathname}?${newParams.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const filters: Filters = {
    type: searchParams.get('type') as CommunityType,
    population: parseNumber(searchParams.get('population')),
    mp_score: searchParams.get('mp_score') as TransparencyScore,
    subventions_score: searchParams.get('subventions_score') as TransparencyScore,
  };

  return { filters, setFilter };
}
