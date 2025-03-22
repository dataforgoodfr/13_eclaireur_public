import { NextResponse } from 'next/server';

import { fetchCommunitiesTopoJSON } from '@/utils/fetchers/communities/fetchCommunitiesTopoJSON-server';

export async function GET() {
  const topoJSON = await fetchCommunitiesTopoJSON();
  return NextResponse.json(topoJSON);
}
