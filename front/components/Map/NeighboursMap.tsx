import { Community } from '@/app/models/community';
import MapWithCityMarkers from '@/components/Map/MapWithCityMarkers';
import { fetchCommunitiesByRadius } from '@/utils/fetchers/communities/fetchCommunitiesByRadius-server';

type CommunityPageProps = { community: Community };

function cleanParseNumber(str: any) {
  return parseFloat(str.replace(',', '.'));
}

export default async function NeighboursMap({ community }: CommunityPageProps) {
  const neighbours = await fetchCommunitiesByRadius(
    cleanParseNumber(community.latitude),
    cleanParseNumber(community.longitude),
    10,
  );

  const center: [number, number] = [
    cleanParseNumber(community.longitude),
    cleanParseNumber(community.latitude),
  ];

  return <MapWithCityMarkers center={center} cities={neighbours} />;
}
