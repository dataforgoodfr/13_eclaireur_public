import { NextResponse } from 'next/server';

import { getQueryFromPool } from '@/utils/db';
import { createSQLQueryParams } from '@/utils/fetchers/communities/fetchCommunitiesBySearch-server';

async function getDataFromPool(query: string, page: number) {
  const params = createSQLQueryParams(query, page);

  console.log({ params });

  return getQueryFromPool(...params);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') ?? '';
    const page = Number(searchParams.get('page')) ?? undefined;

    const data = await getDataFromPool(query, page);

    console.log({ data });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json({ error: 'Internal Server Error with query search' }, { status: 500 });
  }
}
