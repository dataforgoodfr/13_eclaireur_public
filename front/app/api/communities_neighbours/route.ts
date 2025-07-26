import { NextResponse } from 'next/server';

import { getQueryFromPool } from '#utils/db';
import { createSQLQueryParams } from '#utils/fetchers/communities/fetchCommunitiesByRadius-server';

async function getDataFromPool(latitude: number, longitude: number, radius: number) {
  const params = createSQLQueryParams(latitude, longitude, radius);

  return getQueryFromPool(...params);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = Number(searchParams.get('latitude'));
    const longitude = Number(searchParams.get('longitude'));
    const radius = Number(searchParams.get('radius'));

    const data = await getDataFromPool(latitude, longitude, radius);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json({ error: 'Internal Server Error with query search' }, { status: 500 });
  }
}
