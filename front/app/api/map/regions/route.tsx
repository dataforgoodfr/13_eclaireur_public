import { type NextRequest, NextResponse } from 'next/server';

import { getQueryFromPool } from '@/utils/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const codes = searchParams.getAll('codes');
    if (!codes || codes.length === 0) {
      return NextResponse.json({ error: 'No region codes provided' }, { status: 400 });
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
      WHERE c.code_insee_region IN (${placeholders})
        AND c.type = 'REG'
    `;

    const regions = await getQueryFromPool(query, codes);
    return NextResponse.json({ regions });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching regions' }, { status: 500 });
  }
}
