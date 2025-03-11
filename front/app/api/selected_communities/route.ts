import { NextResponse } from 'next/server';

import { getQueryFromPool } from '@/utils/db';
import {
  CommunitiesParams,
  createSQLQueryParams,
} from '@/utils/fetchers/communities/createSQLQueryParams';
import { CommunityType } from '@/utils/types';

function mapCommunityType(type: string | null) {
  if (type === null) return null;

  if (Object.values(CommunityType).includes(type as CommunityType)) {
    return type as CommunityType;
  }

  throw new Error(`Community type is wrong - ${type}`);
}

async function getDataFromPool(options: CommunitiesParams) {
  const params = createSQLQueryParams(options);

  return getQueryFromPool(...params);
}

function isLimitValid(limit: number) {
  return limit < 1 || limit > 5000;
}

function isSirenValid(siren?: string) {
  return siren && !/^\d{9}$/.test(siren);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = mapCommunityType(searchParams.get('type')) ?? undefined;
    const limit = Number(searchParams.get('limit')) ?? undefined;
    const siren = searchParams.get('siren') ?? undefined;

    if (isLimitValid(limit)) {
      return NextResponse.json({ error: 'Limit must be between 1 and 5000' }, { status: 400 });
    }

    if (isSirenValid(siren)) {
      return NextResponse.json({ error: 'Invalid SIREN format' }, { status: 400 });
    }

    const data = await getDataFromPool({ type, limit, siren });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
