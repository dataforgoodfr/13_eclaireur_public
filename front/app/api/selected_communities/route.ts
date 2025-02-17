import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Initialisation du pool PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRESQL_ADDON_USER,
  host: process.env.POSTGRESQL_ADDON_HOST,
  database: process.env.POSTGRESQL_ADDON_DB,
  password: process.env.POSTGRESQL_ADDON_PASSWORD,
  port: parseInt(process.env.POSTGRESQL_ADDON_PORT || '5432', 10),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const limit = Number(searchParams.get('limit')) || 100;

    // Vérification des valeurs 
    if (limit < 1 || limit > 1000) {
      return NextResponse.json({ error: 'Limit must be between 1 and 1000' }, { status: 400 });
    }

    const client = await pool.connect();
    
    let query = 'SELECT * FROM selected_communities';
    const values: unknown[] = [];

    if (type) {
      query += ' WHERE type = $1';
      values.push(type);
    }

    query += ' LIMIT $2';
    values.push(limit);

    const { rows } = await client.query(query, values);
    client.release();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
