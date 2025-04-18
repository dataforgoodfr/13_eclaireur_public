import { NextResponse } from 'next/server';

import { TransparencyScore } from '@/components/TransparencyScore/constants';
import { getQueryFromPool } from '@/utils/db';
import {
  CommunitiesAdvancedSearchFilters,
  createSQLQueryParams,
} from '@/utils/fetchers/advanced-search/fetchCommunitiesAdvancedSearch-server';
import { Pagination } from '@/utils/fetchers/types';
import { CommunityType } from '@/utils/types';

async function getDataFromPool(filters: CommunitiesAdvancedSearchFilters, pagination: Pagination) {
  const params = createSQLQueryParams(filters, pagination);

  return getQueryFromPool(...params);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page'));
    const limit = Number(searchParams.get('limit'));

    const filters = {
      type: (searchParams.get('type') as CommunityType) ?? undefined,
      population: Number(searchParams.get('population')) ?? undefined,
      mp_score: (searchParams.get('mp_score') as TransparencyScore) ?? undefined,
      subventions_score: (searchParams.get('subventions_score') as TransparencyScore) ?? undefined,
    };

    const pagination = {
      page,
      limit,
    };

    const data = await getDataFromPool(filters, pagination);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json({ error: 'Internal Server Error with query search' }, { status: 500 });
  }
}
