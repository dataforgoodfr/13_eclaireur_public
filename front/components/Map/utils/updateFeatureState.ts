import { Community } from '@/app/models/community';

import scoreLetterToNumber from './scoreToNumber';

export default function updateFeatureStates(
  mapInstance: maplibregl.Map,
  communityMap: Record<string, Community>,
  choroplethParameter: string,
  territoryFilterCode: string,
) {
  const features = mapInstance.querySourceFeatures('statesData', {
    sourceLayer: 'administrative',
    filter: ['==', ['get', 'iso_a2'], territoryFilterCode],
  });

  features
    .filter((feature) => feature.properties?.level && feature.properties.level > 0)
    .forEach((feature) => {
      const mapFeature = feature as maplibregl.MapGeoJSONFeature;
      const level = mapFeature.properties.level;
      let adminType: 'region' | 'departement' | 'commune' | undefined;
      if (level === 1) adminType = 'region';
      else if (level === 2) adminType = 'departement';
      else if (level === 3) adminType = 'commune';
      else return;

      let code: string | undefined;
      if (adminType === 'region') {
        if (!mapFeature.id) return;
        code = mapFeature.id.toString().slice(-2);
      } else {
        code =
          mapFeature.properties.code?.toString() || mapFeature.properties.code_insee?.toString();
      }
      if (!code) return;
      const key = `${adminType}-${code}`;
      const community = communityMap[key];
      const value = community
        ? scoreLetterToNumber(community[choroplethParameter as keyof Community] as string)
        : undefined;

      mapInstance.setFeatureState(
        {
          source: 'statesData',
          sourceLayer: 'administrative',
          id: mapFeature.id,
        },
        {
          [choroplethParameter]: value,
        },
      );
    });
}
