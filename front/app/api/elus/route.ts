import { NextResponse } from 'next/server';

import { getQueryFromPool } from '@/utils/db';
import { ElusOptions, createSQLQueryParams } from '@/utils/fetchers/elus/createSQLQueryParams';
import { Pagination } from '@/utils/fetchers/types';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') ?? undefined;
    const limit = Number(searchParams.get('limit')) ?? undefined;
    const page = Number(searchParams.get('page')) ?? undefined;
    const siren = searchParams.get('siren') ?? undefined;

    if (isLimitValid(limit)) {
      return NextResponse.json({ error: 'Limit must be between 1 and 5000' }, { status: 400 });
    }

    if (isSirenValid(siren)) {
      return NextResponse.json({ error: 'Invalid SIREN format' }, { status: 400 });
    }

    const pagination =
      page !== undefined && limit !== undefined
        ? {
            limit,
            page,
          }
        : undefined;
    const data = await getDataFromPool({ filters: { type, siren }, limit }, pagination);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
