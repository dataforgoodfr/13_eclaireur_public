import type { Community } from '#app/models/community';

import scoreLetterToNumber from './scoreToNumber';

/**
 * Calculate the aggregated score based on subventions and marchés publics scores
 * Uses the average of the two scores (E=5, D=4, C=3, B=2, A=1)
 */
function calculateAggregatedScore(
  subventionsScore: string | null | undefined,
  mpScore: string | null | undefined,
): number | undefined {
  if (!subventionsScore && !mpScore) return undefined;

  const subventionsValue = subventionsScore ? scoreLetterToNumber(subventionsScore) : undefined;
  const mpValue = mpScore ? scoreLetterToNumber(mpScore) : undefined;

  if (!subventionsValue && !mpValue) return undefined;
  if (!subventionsValue) return mpValue;
  if (!mpValue) return subventionsValue;

  // Calculate average and round
  return Math.round((subventionsValue + mpValue) / 2);
}

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

  const filteredFeatures = features.filter(
    (feature) => feature.properties?.level && feature.properties.level > 0,
  );

  filteredFeatures.forEach((feature) => {
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
      code = mapFeature.properties.code?.toString() || mapFeature.properties.code_insee?.toString();
    }
    if (!code) return;
    const key = `${adminType}-${code}`;
    const community = communityMap[key];

    let value: number | undefined;
    if (choroplethParameter === 'aggregated_score') {
      // Calculate aggregated score from both mp_score and subventions_score
      value = community
        ? calculateAggregatedScore(
            community.subventions_score as string | null | undefined,
            community.mp_score as string | null | undefined,
          )
        : undefined;
    } else {
      value = community
        ? scoreLetterToNumber(community[choroplethParameter as keyof Community] as string)
        : undefined;
    }

    mapInstance.setFeatureState(
      {
        source: 'statesData',
        sourceLayer: 'administrative',
        id: mapFeature.id,
      },
      {
        [choroplethParameter]: value,
        latitude: community?.latitude,
        longitude: community?.longitude,
        population: community?.population,
      },
    );
  });
}
