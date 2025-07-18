import { NextResponse } from 'next/server';

import { fetchTransparencyScore } from '@/utils/fetchers/communities/fetchTransparencyScore-server';
import { parseNumber } from '@/utils/utils';

export async function GET(request: Request, { params }: { params: Promise<{ siren: string }> }) {
  try {
    const { siren } = await params;
    const { searchParams } = new URL(request.url);
    const year = parseNumber(searchParams.get('year'));

    if (siren === undefined) throw new Error('Siren is not defined');

    if (year === undefined) throw new Error('Year is not defined');

    const data = await fetchTransparencyScore(siren, year);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching transparency score:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
