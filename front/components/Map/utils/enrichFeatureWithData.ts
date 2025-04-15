import mergeTilesAndCommunitiesData from './mergeTilesAndCommunitiesData';
import scoreLetterToNumber from './scoreToNumber';

const enrichFeatureWithData = (feature: any, communityMaps: any) => {
  const enrichedFeature = communityMaps
    ? mergeTilesAndCommunitiesData(feature, communityMaps)
    : feature;

  const population = Number.parseInt(enrichedFeature.properties.population);
  const subventions_score = scoreLetterToNumber(enrichedFeature.properties.subventions_score);
  const mp_score = scoreLetterToNumber(enrichedFeature.properties.mp_score);

  return { ...enrichedFeature, population, subventions_score, mp_score };
};

export default enrichFeatureWithData;
