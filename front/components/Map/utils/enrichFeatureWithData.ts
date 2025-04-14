import mergeTilesAndCommunitiesData from './mergeTilesAndCommunitiesData';
import scoreLetterToNumber from './scoreToNumber';

const enrichFeatureWithData = (feature: any, communityMaps: any) => {
  const enrichedFeature = communityMaps
    ? mergeTilesAndCommunitiesData(feature, communityMaps)
    : feature;

  const population = Number.parseInt(enrichedFeature.properties.population);
  const subventions_score = scoreLetterToNumber(enrichedFeature.properties.subventions_score);

  return { ...enrichedFeature, population, subventions_score };
};

export default enrichFeatureWithData;
