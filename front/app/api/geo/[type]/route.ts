import { type NextRequest, NextResponse } from 'next/server';

import { CommunityType, newFetchGeoData } from '@/utils/fetchers/communities/fetchGeoData';

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  try {
    const paramsObj = await params;
    const type = paramsObj.type;
    let communityType: CommunityType;

    // Map the route parameter to the correct enum value
    switch (type) {
      case 'regions':
        communityType = CommunityType.Region;
        break;
      case 'departments':
        communityType = CommunityType.Departement;
        break;
      case 'communes':
        communityType = CommunityType.Commune;
        break;
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    console.log(`API route handler: Fetching ${type} data`);

    try {
      // Fetch the data on the server side
      const data = await newFetchGeoData(communityType as CommunityType);

      // Return the GeoJSON data
      return NextResponse.json(data);
    } catch (fetchError: any) {
      console.error(`Error fetching ${type} data:`, fetchError);
      return NextResponse.json(
        { error: `Failed to fetch ${type} data: ${fetchError.message}` },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('API route handler error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
