import { NextResponse } from 'next/server';

import { fetchTopMarchesPublicsBySector } from '@/utils/fetchers/marches-publics/fetchTopMarchesPublicsBySector-server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit')) ?? undefined;
    const siren = searchParams.get('siren') ?? undefined;

    if (siren === undefined) {
      throw new Error('siren is not defined');
    }

    const data = await fetchTopMarchesPublicsBySector(siren, limit);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
