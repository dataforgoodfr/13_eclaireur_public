import { Community } from '@/app/models/community';

import getAdminTypeFromLayerId from './getAdminTypeFromLayerId';

const getCommunityDataFromFeature = (
  feature: maplibregl.MapGeoJSONFeature,
  communityMap: Record<string, Community> | null,
): Community | undefined => {
  const props = feature.properties || {};
  let code: string | undefined;

  const adminType = feature.layer ? getAdminTypeFromLayerId(feature.layer.id) : undefined;

  if (adminType === 'region') {
    // For regions, use the last 2 chars of feature.id
    code = feature.id?.toString().slice(-2);
  } else {
    // For others, use code or code_insee
    code = props.code?.toString() || props.code_insee?.toString();
  }

  if (communityMap && code) {
    return communityMap[code];
  }

  return undefined;
};

export default getCommunityDataFromFeature;
