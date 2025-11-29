import { NextRequest, NextResponse } from 'next/server';

import { fetchMarchesPublicsComparison } from '#utils/fetchers/marches-publics/fetchMarchesPublicsComparison-server';
import { ScopeType } from '#utils/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siren: string }> },
) {
  try {
    const { siren } = await params;
    const { searchParams } = new URL(request.url);
    const scopeType = searchParams.get('scope') as ScopeType || ScopeType.Region;

    if (siren === undefined) {
      throw new Error('Siren is not defined');
    }

    const data = await fetchMarchesPublicsComparison(siren, scopeType);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching marches publics comparison:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
