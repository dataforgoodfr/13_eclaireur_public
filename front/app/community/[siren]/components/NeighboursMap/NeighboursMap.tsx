import type { City } from '#app/community/[siren]/components/NeighboursMap/MapWithCityMarkers';
import { Community } from '#app/models/community';
import { fetchCommunitiesByRadius } from '#utils/fetchers/communities/fetchCommunitiesByRadius-server';

import LazyMapWithCityMarkers from './LazyMapWithCityMarkers';

type CommunityPageProps = { community: Community };

function isValid(city: Pick<Community, 'latitude' | 'longitude' | 'nom'>): city is City {
  return city.latitude !== null && city.longitude !== null;
}

export default async function NeighboursMap({ community }: CommunityPageProps) {
  const center: [number, number] = [community?.latitude ?? 0, community?.longitude ?? 0];

  const neighbours = await fetchCommunitiesByRadius(...center, 10);

  const validNeighbours = neighbours.filter(isValid);

  return <LazyMapWithCityMarkers center={center} cities={validNeighbours} />;
}
