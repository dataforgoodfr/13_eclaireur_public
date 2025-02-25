import { NextResponse } from 'next/server';

import db from '@/utils/db';
import { CommunityType } from './types';

type CommunitiesParamsOptions = {
  type: CommunityType | undefined;
  limit: number;
};

function mapCommunityType(type: string | null) {
  if (type === null) return null;

  if (Object.values(CommunityType).includes(type as CommunityType)) {
    return type as CommunityType;
  }

  throw new Error(`Community type is wrong - ${type}`);
}

async function getDataFromPool(options: CommunitiesParamsOptions) {
  const { type, limit } = options;
  const client = await db.connect();

  let query = 'SELECT * FROM selected_communities';
  const values: unknown[] = [];

  query += ' LIMIT $1';
  values.push(limit);

  if (type) {
    query += ' WHERE type = $2';
    values.push(type);
  }

  const { rows } = await client.query(query, values);
  client.release();

  return rows;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = mapCommunityType(searchParams.get('type')) ?? undefined;
    const limit = Number(searchParams.get('limit')) ?? undefined;

    // Vérification des valeurs
    if (limit < 1 || limit > 5000) {
      return NextResponse.json({ error: 'Limit must be between 1 and 5000' }, { status: 400 });
    }

    const data = await getDataFromPool({ type, limit });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
