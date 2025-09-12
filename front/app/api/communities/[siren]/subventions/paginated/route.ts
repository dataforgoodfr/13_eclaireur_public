import { NextResponse } from 'next/server';

import { Subvention } from '#app/models/subvention';
import { fetchSubventionPaginated } from '#utils/fetchers/subventions/fetchSubventionPaginated-server';
import { parseNumber } from '#utils/utils';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export async function GET(request: Request, { params }: { params: Promise<{ siren: string }> }) {
  try {
    const { siren } = await params;
    const { searchParams } = new URL(request.url);

    if (siren === undefined) {
      throw new Error('Siren is not defined');
    }

    const year = parseNumber(searchParams.get('year'));
    const by = searchParams.get('by') as keyof Subvention;
    const page = parseNumber(searchParams.get('page')) ?? DEFAULT_PAGE;
    const limit = parseNumber(searchParams.get('limit')) ?? DEFAULT_LIMIT;

    const pagination = {
      page,
      limit,
    };

    const data = await fetchSubventionPaginated(siren, year ?? null, pagination, by);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
