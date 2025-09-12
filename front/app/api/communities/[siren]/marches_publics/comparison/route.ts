import { NextRequest, NextResponse } from 'next/server';

import { fetchMarchesPublicsComparison } from '#utils/fetchers/marches-publics/fetchMarchesPublicsComparison-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siren: string }> },
) {
  try {
    const { siren } = await params;
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'régional';

    if (siren === undefined) {
      throw new Error('Siren is not defined');
    }

    const data = await fetchMarchesPublicsComparison(siren, scope);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching marches publics comparison:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
