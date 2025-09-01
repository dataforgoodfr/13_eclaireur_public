import { NextResponse } from 'next/server';

import { getCopyStream } from '#app/api/csv-stream/utils';
import { createSQLQueryParams } from '#utils/fetchers/marches-publics/createSQLQueryParams';
import { parseNumber } from '#utils/utils';

const DEFAULT_FILE_NAME = 'marches_publics_contrats.csv';

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

    const year = parseNumber(searchParams.get('year'));

    if (year === undefined) {
      throw new Error('year is not defined');
    }

    const stream = await getStream({
      selectors: ['titulaire_denomination_sociale', 'objet', 'montant', 'annee_notification'],
      filters: { acheteur_id: siren, annee_notification: year },
      orderBy: { direction: 'desc', column: 'montant' },
    });

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
