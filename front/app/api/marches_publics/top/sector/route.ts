import { NextResponse } from 'next/server';

import { fetchTopMarchesPublicsBySector } from '@/utils/fetchers/marches-publics/fetchTopMarchesPublicsBySector-server';
import { parseNumber } from '@/utils/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const siren = searchParams.get('siren') ?? undefined;
    const year = parseNumber(searchParams.get('year'));
    const limit = Number(searchParams.get('limit')) ?? undefined;

    if (siren === undefined) {
      throw new Error('Siren is not defined');
    }

    if (year === undefined) {
      throw new Error('Year is not defined');
    }

    const data = await fetchTopMarchesPublicsBySector(siren, year, limit);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
