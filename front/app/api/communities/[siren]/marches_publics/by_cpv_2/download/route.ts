import { NextResponse } from 'next/server';

import { getCopyStream } from '#app/api/csv-stream/utils';
import { createSQLQueryParams } from '#utils/fetchers/marches-publics/fetchMarchesPublicsByCPV2-server';
import { parseNumber } from '#utils/utils';

const DEFAULT_FILE_NAME = 'marches_publics_by_cpv_2.csv';
const MAX_NUMBER_ROWS = 1_000_000;

async function getStream(...params: Parameters<typeof createSQLQueryParams>) {
  const queryParams = createSQLQueryParams(...params);

  return await getCopyStream(...queryParams);
}

export async function GET(request: Request, { params }: { params: Promise<{ siren: string }> }) {
  try {
    const { siren } = await params;
    const { searchParams } = new URL(request.url);

    if (siren === undefined) {
      throw new Error('Siren is not defined');
    }

    const year = parseNumber(searchParams.get('year')) ?? null;

    const pagination = {
      page: 1,
      limit: MAX_NUMBER_ROWS,
    };

    const stream = await getStream(siren, year, pagination);

    const headers = new Headers({
      'Content-Disposition': `attachment; filename=${DEFAULT_FILE_NAME}`,
      'Content-Type': 'text/csv; charset=utf-8',
    });

    return new NextResponse(stream, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error fetching CSV:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while fetching CSV' },
      { status: 500 },
    );
  }
}
