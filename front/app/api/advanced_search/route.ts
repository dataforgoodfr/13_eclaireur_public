import { NextResponse } from 'next/server';

import { AdvancedSearchOrder } from '@/app/advanced-search/hooks/useOrderParams';
import { TransparencyScore } from '@/components/TransparencyScore/constants';
import { getQueryFromPool } from '@/utils/db';
import {
  CommunitiesAdvancedSearchFilters,
  createSQLQueryParams,
} from '@/utils/fetchers/advanced-search/fetchCommunitiesAdvancedSearch-server';
import { Pagination } from '@/utils/fetchers/types';
import { CommunityType } from '@/utils/types';
import { parseDirection, parseNumber } from '@/utils/utils';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

const DEFAULT_ORDER: AdvancedSearchOrder = {
  by: 'type',
  direction: 'ASC',
};

async function getDataFromPool(
  filters: CommunitiesAdvancedSearchFilters,
  pagination: Pagination,
  order: AdvancedSearchOrder,
) {
  const params = createSQLQueryParams(filters, pagination, order);

  return getQueryFromPool(...params);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseNumber(searchParams.get('page')) ?? DEFAULT_PAGE;
    const limit = parseNumber(searchParams.get('limit')) ?? DEFAULT_LIMIT;

    const by = (searchParams.get('by') as AdvancedSearchOrder['by']) ?? DEFAULT_ORDER.by;
    const direction = parseDirection(searchParams.get('direction')) ?? DEFAULT_ORDER.direction;

    const filters = {
      type: (searchParams.get('type') as CommunityType) ?? undefined,
      population: parseNumber(searchParams.get('population')) ?? undefined,
      mp_score: (searchParams.get('mp_score') as TransparencyScore) ?? undefined,
      subventions_score: (searchParams.get('subventions_score') as TransparencyScore) ?? undefined,
    };

    const pagination = {
      page,
      limit,
    };

    const order = {
      by,
      direction,
    };

    const data = await getDataFromPool(filters, pagination, order);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json({ error: 'Internal Server Error with query search' }, { status: 500 });
  }
}
