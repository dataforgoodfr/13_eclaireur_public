import { type NextRequest, NextResponse } from 'next/server';

import { getQueryFromPool } from '@/utils/db';

// Handle GET requests (keeping for backward compatibility)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const codes = searchParams.getAll('codes');

    if (!codes || codes.length === 0) {
      return NextResponse.json({ error: 'No commune codes provided' }, { status: 400 });
    }

    // Create a parameterized query with placeholders
    const placeholders = codes.map((_, index) => `$${index + 1}`).join(',');
    const query = `
      SELECT * FROM collectivites
      WHERE code_insee IN (${placeholders})
      AND type = 'DEP'
    `;

    // Execute database query with the values array as second parameter
    const departements = await getQueryFromPool(query, codes);
    return NextResponse.json({ departements });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching communes' }, { status: 500 });
  }
}
