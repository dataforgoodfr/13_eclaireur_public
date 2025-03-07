import { NextResponse } from 'next/server';

import db from '@/utils/db';

import { CommunityType } from './types';

type CommunitiesParamsOptions = {
  type: CommunityType | undefined;
  limit: number;
  siren?: string;
};

function mapCommunityType(type: string | null) {
  if (type === null) return null;

  if (Object.values(CommunityType).includes(type as CommunityType)) {
    return type as CommunityType;
  }

  throw new Error(`Community type is wrong - ${type}`);
}

async function getDataFromPool(options: CommunitiesParamsOptions) {
  const { type, limit, siren } = options;
  const client = await db.connect();

  let query = 'SELECT * FROM selected_communities';
  const values: unknown[] = [];

  //Construction des conditions WHERE
  const whereConditions: string[] = [];

  if (type) {
    whereConditions.push(`type = $${values.length + 1}`);
    values.push(type);
  }

  if (siren) {
    whereConditions.push(`siren = $${values.length + 1}`);
    values.push(siren);
  }

  if (whereConditions.length > 0) {
    query += ' WHERE ' + whereConditions.join(' AND ');
  }

  //Ajout de la limite
  query += ' LIMIT $' + (values.length + 1);
  values.push(limit);

  const { rows } = await client.query(query, values);
  client.release();

  return rows;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = mapCommunityType(searchParams.get('type')) ?? undefined;
    const limit = Number(searchParams.get('limit')) ?? undefined;
    const siren = searchParams.get('siren') ?? undefined;

    // Vérification des valeurs
    if (limit < 1 || limit > 5000) {
      return NextResponse.json({ error: 'Limit must be between 1 and 5000' }, { status: 400 });
    }

    // Validation optionnelle du format SIREN
    if (siren && !/^\d{9}$/.test(siren)) {
      return NextResponse.json({ error: 'Invalid SIREN format' }, { status: 400 });
    }

    const data = await getDataFromPool({ type, limit, siren });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
