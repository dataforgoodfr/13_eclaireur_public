import { NextResponse } from 'next/server';
import { createSearchParamsCache, parseAsInteger, parseAsString } from 'nuqs/server';

import { getQueryFromPool } from '#utils/db';
import { createSQLQueryParams } from '#utils/fetchers/communities/fetchCommunitiesBySearch-server';

async function getDataFromPool(query: string, page: number) {
  const params = createSQLQueryParams(query, page);

  return getQueryFromPool(...params);
}

const searchParamsCache = createSearchParamsCache({
  query: parseAsString.withDefault(''),
  page: parseAsInteger,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = searchParamsCache.parse(searchParams as unknown as Record<string, string | string[] | undefined>);

    const data = await getDataFromPool(params.query, params.page ?? 1);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json({ error: 'Internal Server Error with query search' }, { status: 500 });
  }
}
