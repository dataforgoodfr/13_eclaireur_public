import MapWithCityMarkers from '@/app/community/[siren]/components/NeighboursMap/MapWithCityMarkers';
import { CommunityV0 } from '@/app/models/community';
import { fetchCommunitiesByRadius } from '@/utils/fetchers/communities/fetchCommunitiesByRadius-server';

// TODO - fix when lat long are added in table
type CommunityPageProps = { community: CommunityV0 };

function cleanParseNumber(str: any) {
  return parseFloat(str.replace(',', '.'));
}

// TODO - fix when lat long are added in table
export default async function NeighboursMap({ community }: CommunityPageProps) {
  const center: [number, number] = [
    cleanParseNumber(community?.latitude ?? '0'),
    cleanParseNumber(community?.longitude ?? '0'),
  ];

  const neighbours = await fetchCommunitiesByRadius(...center, 10);

  return <MapWithCityMarkers center={center} cities={neighbours} />;
}
