// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg'; // Assuming you're using PostgreSQL

// Set up the connection pool for PostgreSQL using environment variables
const pool = new Pool({
  user: process.env.POSTGRESQL_ADDON_USER,
  host: process.env.POSTGRESQL_ADDON_HOST,
  database: process.env.POSTGRESQL_ADDON_DB,
  password: process.env.POSTGRESQL_ADDON_PASSWORD,
  port: parseInt(process.env.POSTGRESQL_ADDON_PORT || '5432', 10), // Default to 5432 if not set
});

type Community = {
  siren: number;
  nom: string;
  type: string;
  population: string;
  longitude: number
  latitude: number;

};

// Named export for the GET method
export async function GET() {
  try {
    const { rows } = await pool.query<Community>('SELECT * FROM selected_communities');
    return NextResponse.json(rows); 
  } catch (error) {
    console.error('Error fetching data from database:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}