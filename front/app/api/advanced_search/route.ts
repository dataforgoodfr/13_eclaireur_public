import { NextResponse } from 'next/server';
import { createSearchParamsCache, parseAsInteger, parseAsString, parseAsStringEnum } from 'nuqs/server';

import { AdvancedSearchOrder } from '#app/advanced-search/hooks/useOrderParams';
import { TransparencyScore } from '#components/TransparencyScore/constants';
import { fetchCommunitiesAdvancedSearch } from '#utils/fetchers/advanced-search/fetchCommunitiesAdvancedSearch-server';
import { CommunityType } from '#utils/types';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

const DEFAULT_ORDER: AdvancedSearchOrder = {
  by: 'type',
  direction: 'ASC',
};

const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(DEFAULT_PAGE),
  limit: parseAsInteger.withDefault(DEFAULT_LIMIT),
  by: parseAsStringEnum(['nom', 'type', 'population', 'mp_score', 'subventions_score', 'subventions_budget'] as const)
    .withDefault(DEFAULT_ORDER.by),
  direction: parseAsStringEnum(['ASC', 'DESC'] as const).withDefault(DEFAULT_ORDER.direction),
  type: parseAsString,
  population: parseAsInteger,
  mp_score: parseAsString,
  subventions_score: parseAsString,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = searchParamsCache.parse(searchParams);

    const filters = {
      type: params.type as CommunityType ?? undefined,
      population: params.population ?? undefined,
      mp_score: params.mp_score as TransparencyScore ?? undefined,
      subventions_score: params.subventions_score as TransparencyScore ?? undefined,
    };

    const pagination = {
      page: params.page,
      limit: params.limit,
    };

    const order = {
      by: params.by,
      direction: params.direction,
    };

    const data = await fetchCommunitiesAdvancedSearch(filters, pagination, order);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching advanced search data:', error);
    return NextResponse.json({ error: 'Internal Server Error with query search' }, { status: 500 });
  }
}
