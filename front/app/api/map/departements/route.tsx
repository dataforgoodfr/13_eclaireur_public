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
      SELECT 
        c.*,
        b.subventions_score,
        b.mp_score
      FROM collectivites c
      LEFT JOIN bareme b
        ON c.siren = b.siren AND b.annee = 2024
      WHERE c.code_insee IN (${placeholders})
        AND c.type = 'DEP'
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
