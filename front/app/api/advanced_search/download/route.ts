import { NextResponse } from 'next/server';

import { AdvancedSearchOrder } from '@/app/advanced-search/hooks/useOrderParams';
import { TransparencyScore } from '@/components/TransparencyScore/constants';
import {
  CommunitiesAdvancedSearchFilters,
  createSQLQueryParams,
} from '@/utils/fetchers/advanced-search/fetchCommunitiesAdvancedSearch-server';
import { Pagination } from '@/utils/fetchers/types';
import { CommunityType } from '@/utils/types';
import { parseDirection, parseNumber } from '@/utils/utils';

import { getCopyStream } from '../../csv-stream/utils';

const DEFAULT_FILE_NAME = 'advanced_search_communities.csv';
const MAX_NUMBER_ROWS = 1_000_000;

const DEFAULT_ORDER: AdvancedSearchOrder = {
  by: 'type',
  direction: 'ASC',
};

/**
 * Get streamed copy of table from db
 * @param params
 * @returns
 */
async function getStream(
  filters: CommunitiesAdvancedSearchFilters,
  pagination: Pagination,
  order: AdvancedSearchOrder,
) {
  const queryParams = createSQLQueryParams(filters, pagination, order);

  return await getCopyStream(...queryParams);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      type: (searchParams.get('type') as CommunityType) ?? undefined,
      population: parseNumber(searchParams.get('population')) ?? undefined,
      mp_score: (searchParams.get('mp_score') as TransparencyScore) ?? undefined,
      subventions_score: (searchParams.get('subventions_score') as TransparencyScore) ?? undefined,
    };

    const pagination = {
      page: 1,
      limit: MAX_NUMBER_ROWS,
    };

    const order = {
      by: (searchParams.get('by') as AdvancedSearchOrder['by']) ?? DEFAULT_ORDER.by,
      direction: parseDirection(searchParams.get('direction')) ?? DEFAULT_ORDER.direction,
    };

    const stream = await getStream(filters, pagination, order);

    const headers = new Headers({
      'Content-Disposition': `attachment; filename=${DEFAULT_FILE_NAME}`,
      'Content-Type': 'text/csv; charset=utf-8',
    });

    return new NextResponse(stream, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.log('Error while fetching CSV:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while fetching CSV' },
      { status: 500 },
    );
  }
}
