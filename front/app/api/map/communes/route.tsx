import { type NextRequest, NextResponse } from 'next/server';

import { getQueryFromPool } from '#utils/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const codes = searchParams.getAll('codes');
    const year = searchParams.get('year') || '2023';

    if (!codes || codes.length === 0) {
      return NextResponse.json({ error: 'No commune codes provided' }, { status: 400 });
    }

    const values = [...codes, year];
    const placeholders = codes.map((_, index) => `$${index + 1}`).join(',');
    const query = `
      SELECT
        c.*,
        b.subventions_score,
        b.mp_score
      FROM collectivites c
      LEFT JOIN bareme b
        ON c.siren = b.siren AND b.annee = $${values.length}
      WHERE c.code_insee IN (${placeholders})
        AND c.type = 'COM'
    `;

    const communes = await getQueryFromPool(query, values);

    return NextResponse.json({ communes });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching communes' }, { status: 500 });
  }
}

// POST handler for larger datasets
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { codes, year = 2024 } = body;

    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return NextResponse.json(
        { error: 'No commune codes provided or invalid format' },
        { status: 400 },
      );
    }

    console.log(`Received POST request for ${codes.length} communes`);

    const values = [...codes, year];
    const placeholders = codes.map((_, index) => `$${index + 1}`).join(',');
    const query = `
      SELECT
        c.*,
        b.subventions_score,
        b.mp_score
      FROM collectivites c
      LEFT JOIN bareme b
        ON c.siren = b.siren AND b.annee = $${values.length}
      WHERE c.code_insee IN (${placeholders})
        AND c.type = 'COM'
    `;

    const communes = await getQueryFromPool(query, values);

    return NextResponse.json({ communes });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching communes' }, { status: 500 });
  }
}
