import { Community } from '#app/models/community';
import { TransparencyScore } from '#components/TransparencyScore/constants';
import { CommunityType } from '#utils/types';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

import { DEFAULT_PAGE } from './usePaginationParams';

type Filters = Partial<Pick<Community, 'type' | 'population' | 'mp_score' | 'subventions_score'>>;

type ReturnType = {
  filters: Filters;
  setFilter: (key: string, value: string | null) => void;
};

const filtersParser = {
  type: parseAsString,
  population: parseAsInteger,
  mp_score: parseAsString,
  subventions_score: parseAsString,
  page: parseAsInteger.withDefault(DEFAULT_PAGE),
};

export function useFiltersParams(): ReturnType {
  const [params, setParams] = useQueryStates(filtersParser);

  const setFilter = (key: string, value: string | null) => {
    setParams({
      [key]: value,
      page: DEFAULT_PAGE,
    });
  };

  const filters: Filters = {
    type: params.type as CommunityType,
    population: params.population ?? undefined,
    mp_score: params.mp_score as TransparencyScore,
    subventions_score: params.subventions_score as TransparencyScore,
  };

  return { filters, setFilter };
}
