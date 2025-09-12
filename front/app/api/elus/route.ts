import { NextResponse } from 'next/server';

import { getQueryFromPool } from '#utils/db';
import { ElusOptions, createSQLQueryParams } from '#utils/fetchers/elus/createSQLQueryParams';
import { Pagination } from '#utils/fetchers/types';
import { createSearchParamsCache, parseAsInteger, parseAsString } from 'nuqs/server';

async function getDataFromPool(options: ElusOptions, pagination?: Pagination) {
  const params = createSQLQueryParams(options, pagination);

  return getQueryFromPool(...params);
}

function isLimitValid(limit: number) {
  return limit < 1 || limit > 5000;
}

function isSirenValid(siren?: string) {
  return siren && !/^\d{9}$/.test(siren);
}

const searchParamsCache = createSearchParamsCache({
  type: parseAsString,
  limit: parseAsInteger,
  page: parseAsInteger,
  siren: parseAsString,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = searchParamsCache.parse(
      searchParams as unknown as Record<string, string | string[] | undefined>,
    );

    if (params.limit !== null && isLimitValid(params.limit)) {
      return NextResponse.json({ error: 'Limit must be between 1 and 5000' }, { status: 400 });
    }

    if (isSirenValid(params.siren ?? undefined)) {
      return NextResponse.json({ error: 'Invalid SIREN format' }, { status: 400 });
    }

    const pagination =
      params.page !== null && params.limit !== null
        ? {
            limit: params.limit,
            page: params.page,
          }
        : undefined;
    const data = await getDataFromPool(
      {
        filters: { type: params.type ?? undefined, siren: params.siren ?? undefined },
        limit: params.limit ?? undefined,
      },
      pagination,
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
