import { NextResponse } from 'next/server';

import { ComparisonType } from '@/app/community/[siren]/comparison/[comparedSiren]/components/ComparisonType';
import { getEnumFromString, parseNumber } from '@/utils/utils';
import { fetchMPSubvComparison } from '@/utils/fetchers/communities/fetchMPSubvComparison-server';

export async function GET(request: Request, { params }: { params: Promise<{ siren: string }> }) {
  try {
    const { siren } = await params;
    const { searchParams } = new URL(request.url);
    const year:number |undefined = parseNumber(searchParams.get('year'));
    const comparisonTypeParam = searchParams.get('comparisonType');

    if (siren === undefined) throw new Error('Siren is not defined');
    if (year === undefined) throw new Error('Year is not defined');
    if (comparisonTypeParam === null) throw new Error('ComparisonType is not defined');

    const comparisonType = getEnumFromString(ComparisonType, comparisonTypeParam)
    const data = await fetchMPSubvComparison(siren, year, comparisonType);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching MPSubvComparison:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
