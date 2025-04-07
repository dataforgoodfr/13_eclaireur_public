import { type NextRequest, NextResponse } from 'next/server';

import { getQueryFromPool } from '@/utils/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const codes = searchParams.getAll('codes');

    if (!codes || codes.length === 0) {
      return NextResponse.json({ error: 'No commune codes provided' }, { status: 400 });
    }

    const placeholders = codes.map((_, index) => `$${index + 1}`).join(',');
    const query = `
      SELECT * FROM collectivites
      WHERE code_insee IN (${placeholders})
      AND type = 'DEP'
    `;

    const departements = await getQueryFromPool(query, codes);
    return NextResponse.json({ departements });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error fetching departements' },
      { status: 500 },
    );
  }
}
