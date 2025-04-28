import { Community } from '@/app/models/community';

import getAdminTypeFromLayerId from './getAdminTypeFromLayerId';

const getCommunityDataFromFeature = (
  feature: maplibregl.MapGeoJSONFeature,
  maps: {
    communesByCode: Record<string, Community>;
    departmentsByCode: Record<string, Community>;
    regionsByCode: Record<string, Community>;
  } | null, // Allow null for communityMapsRef.current before it's initialized
): Community | undefined => {
  const props = feature.properties || {};
  const layerId = feature.layer.id;
  const type = getAdminTypeFromLayerId(layerId);
  const code = props.code?.toString();
  const regionCode = feature.id?.toString().slice(-2);

  // Ensure that maps is not null before accessing properties
  if (maps) {
    if (type === 'commune' && code) {
      return maps.communesByCode[code];
    } else if (type === 'departement' && code) {
      return maps.departmentsByCode[code];
    } else if (type === 'region' && regionCode) {
      return maps.regionsByCode[regionCode];
    }
  }

  // Return undefined if no matching data is found
  return undefined;
};

export default getCommunityDataFromFeature;
