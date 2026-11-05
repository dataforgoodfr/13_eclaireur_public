import { NextResponse } from 'next/server';

import { MarchePublic } from '#app/models/marchePublic';
import { fetchMarchesPublicsPaginated } from '#utils/fetchers/marches-publics/fetchMarchesPublicsPaginated-server';
import { parseNumber } from '#utils/utils';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;
const MAX_LIMIT = 100;

export async function GET(request: Request, { params }: { params: Promise<{ siren: string }> }) {
  try {
    const { siren } = await params;
    const { searchParams } = new URL(request.url);

    if (siren === undefined) {
      throw new Error('Siren is not defined');
    }

    const year = parseNumber(searchParams.get('year'));
    // Validated against an allow-list in the fetcher; undefined falls back to the default.
    const by = (searchParams.get('by') ?? undefined) as keyof MarchePublic | undefined;
    const page = Math.max(1, Math.trunc(parseNumber(searchParams.get('page')) ?? DEFAULT_PAGE));
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, Math.trunc(parseNumber(searchParams.get('limit')) ?? DEFAULT_LIMIT)),
    );

    const pagination = {
      page,
      limit,
    };

    const data = await fetchMarchesPublicsPaginated(siren, year ?? null, pagination, by);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
