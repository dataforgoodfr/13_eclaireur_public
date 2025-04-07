import { type NextRequest, NextResponse } from 'next/server';

import { getQueryFromPool } from '@/utils/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const codes = searchParams.getAll('codes');
    if (!codes || codes.length === 0) {
      return NextResponse.json({ error: 'No region codes provided' }, { status: 400 });
    }

    // Create a parameterized query with placeholders
    const placeholders = codes.map((_, index) => `$${index + 1}`).join(',');
    const query = `
    SELECT * FROM collectivites 
    WHERE code_insee_region IN (${placeholders})
    AND type = 'REG';
    `;

    // Execute database query with the values array as second parameter
    const regions = await getQueryFromPool(query, codes);
    return NextResponse.json({ regions });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching communes' }, { status: 500 });
  }
}
