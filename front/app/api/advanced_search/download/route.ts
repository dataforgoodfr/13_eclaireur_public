import { NextResponse } from 'next/server';

import { TransparencyScore } from '@/components/TransparencyScore/constants';
import {
  CommunitiesAdvancedSearchFilters,
  createSQLQueryParams,
} from '@/utils/fetchers/advanced-search/fetchCommunitiesAdvancedSearch-server';
import { Pagination } from '@/utils/fetchers/types';
import { CommunityType } from '@/utils/types';

import { getCopyStream } from '../../csv-stream/utils';

const DEFAULT_FILE_NAME = 'advanced_search_communities.csv';
const MAX_NUMBER_ROWS = 1_000_000;

/**
 * Get streamed copy of table from db
 * @param params
 * @returns
 */
async function getStream(filters: CommunitiesAdvancedSearchFilters, pagination: Pagination) {
  const queryParams = createSQLQueryParams(filters, pagination);

  return await getCopyStream(...queryParams);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      type: (searchParams.get('type') as CommunityType) ?? undefined,
      population: Number(searchParams.get('population')) ?? undefined,
      mp_score: (searchParams.get('mp_score') as TransparencyScore) ?? undefined,
      subventions_score: (searchParams.get('subventions_score') as TransparencyScore) ?? undefined,
    };

    const pagination = {
      page: 1,
      limit: MAX_NUMBER_ROWS,
    };

    const stream = await getStream(filters, pagination);

    const headers = new Headers({
      'Content-Disposition': `attachment; filename=${DEFAULT_FILE_NAME}`,
      'Content-Type': 'text/csv; charset=utf-8',
    });

    return new NextResponse(stream, {
      status: 200,
      headers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error while fetching CSV' },
      { status: 500 },
    );
  }
}
