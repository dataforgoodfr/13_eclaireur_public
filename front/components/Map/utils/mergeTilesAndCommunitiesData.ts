import { Community } from "@/app/models/community";
import type { CommunityMaps } from "../types";
/**
 * Merges community data (region, department, or commune) into a GeoJSON tile feature
 * based on its administrative level and unique identifier.
 *
 * This function clones the input feature to avoid mutating the original,
 * finds the corresponding community data from the appropriate list,
 * and merges it into the feature's properties.
 *
 * @param {maplibregl.GeoJSONFeature} feature - The tile feature to enrich.
 * @param {Community[]} regions - List of region-level community data.
 * @param {Community[]} departements - List of department-level community data.
 * @param {Community[]} communes - List of commune-level community data.
 * @returns {maplibregl.GeoJSONFeature} A new GeoJSON feature with merged properties.
 */



enum FeatureLevel {
  Region = 1,
  Department = 2,
  Commune = 3
}

const mergeTilesAndCommunitiesData = (
  feature: maplibregl.GeoJSONFeature,
  communityMaps: CommunityMaps,
): maplibregl.GeoJSONFeature => {

  const featureCopy = JSON.parse(JSON.stringify(feature)) as maplibregl.GeoJSONFeature;

  const level = featureCopy.properties.level;
  let featureId: string | undefined;
  let communityData: Partial<Community> | undefined;

  // Find the appropriate community data based on the feature level
  if (level === FeatureLevel.Region) {
    featureId = featureCopy.id?.toString().slice(-2);
    communityData = featureId ? communityMaps.regionsByCode[featureId] : undefined;
  } else if (level === FeatureLevel.Department) {
    featureId = featureCopy.properties.code;
    communityData = featureId ? communityMaps.departmentsByCode[featureId] : undefined;
  } else if (level === FeatureLevel.Commune) {
    featureId = featureCopy.properties.code;
    communityData = featureId ? communityMaps.communesByCode[featureId] : undefined;
  }

  // Update the properties on the copied feature
  if (communityData) {
    featureCopy.properties = {
      ...featureCopy.properties,
      ...communityData,
    };
  }

  return featureCopy;
};

export default mergeTilesAndCommunitiesData