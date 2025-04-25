import { NextResponse } from 'next/server';

import { fetchTopSubventionsByNaf } from '@/utils/fetchers/subventions/fetchTopSubventionsByNaf-server';
import { parseNumber } from '@/utils/utils';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const siren = searchParams.get('siren') ?? undefined;

    if (siren === undefined) {
      throw new Error('Siren is not defined');
    }

    const year = parseNumber(searchParams.get('year'));
    const page = parseNumber(searchParams.get('page')) ?? DEFAULT_PAGE;
    const limit = parseNumber(searchParams.get('limit')) ?? DEFAULT_LIMIT;

    const pagination = {
      page,
      limit,
    };

    const data = await fetchTopSubventionsByNaf(siren, year ?? null, pagination);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
