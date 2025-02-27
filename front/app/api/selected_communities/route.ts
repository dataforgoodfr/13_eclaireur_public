import { NextResponse } from 'next/server';

import db from '@/utils/db';
import { createSQLQueryParams } from '@/utils/fetchers/communities/createSQLQueryParams';
import { CommunityType } from '@/utils/types';

import { CommunitiesParamsOptions } from './types';

function mapCommunityType(type: string | null) {
  if (type === null) return null;

  if (Object.values(CommunityType).includes(type as CommunityType)) {
    return type as CommunityType;
  }

  throw new Error(`Community type is wrong - ${type}`);
}

async function getDataFromPool(options: CommunitiesParamsOptions) {
  const client = await db.connect();

  const params = createSQLQueryParams(options);

  const { rows } = await client.query(...params);

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
