import { NextResponse } from 'next/server';

import { fetchSubventionYearlyAmounts } from '@/utils/fetchers/subventions/fetchSubventionYearlyAmounts-server';

export async function GET(_: Request, { params }: { params: Promise<{ siren: string }> }) {
  try {
    const { siren } = await params;

    if (siren === undefined) {
      throw new Error('Siren is not defined');
    }

    const data = await fetchSubventionYearlyAmounts(siren);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching subvention yearly amounts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
