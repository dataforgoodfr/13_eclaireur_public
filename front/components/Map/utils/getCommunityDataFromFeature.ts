import { Community } from '@/app/models/community';

import getAdminTypeFromLayerId from './getAdminTypeFromLayerId';

const getCommunityDataFromFeature = (
  feature: maplibregl.MapGeoJSONFeature,
  communityMap: Record<string, Community> | null,
): Community | undefined => {
  const props = feature.properties || {};
  const adminType = feature.layer ? getAdminTypeFromLayerId(feature.layer.id) : undefined;
  let code: string | undefined;
  if (adminType === 'region') {
    code = feature.id?.toString().slice(-2);
  } else {
    code = props.code?.toString() || props.code_insee?.toString();
  }

  if (communityMap && code && adminType) {
    return communityMap[`${adminType}-${code}`];
  }

  return undefined;
};
export default getCommunityDataFromFeature;
