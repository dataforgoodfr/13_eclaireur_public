import type maplibregl from 'maplibre-gl';

import getFeaturesByLevel from './getFeaturesByLevel';

export function updateVisibleCodes(
  mapInstance: maplibregl.Map,
  filterCode: string,
  setVisibleRegionCodes: (codes: string[]) => void,
  setVisibleDepartementCodes: (codes: string[]) => void,
  setVisibleCommuneCodes: (codes: string[]) => void,
) {
  const features = mapInstance.querySourceFeatures('statesData', {
    sourceLayer: 'administrative',
    filter: ['==', ['get', 'iso_a2'], filterCode],
  });

  const { regions, departments, communes } = getFeaturesByLevel(features);

  setVisibleRegionCodes(regions.map((f) => f.id?.toString().slice(-2)).filter(Boolean));
  setVisibleDepartementCodes(departments.map((f) => f.properties.code));
  setVisibleCommuneCodes(communes.map((f) => f.properties.code));
}
