import { NextResponse } from 'next/server';

import { fetchSubventionYearlyCounts } from '@/utils/fetchers/subventions/fetchSubventionYearlyCounts-server';

export async function GET(_: Request, { params }: { params: Promise<{ siren: string }> }) {
  try {
    const { siren } = await params;

    if (siren === undefined) {
      throw new Error('Siren is not defined');
    }

    const data = await fetchSubventionYearlyCounts(siren);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
