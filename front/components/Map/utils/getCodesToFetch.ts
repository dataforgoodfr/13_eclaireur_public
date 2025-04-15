import { FeatureLevel } from '../types';

const getCodesToFetch = (
  feature: any, // Replace `any` with the correct feature type if possible
  level: number,
  fetchedCodes: Set<string>,
  cacheRef: React.RefObject<any[]>,
  pushCodesToFetch: (code: string) => void,
) => {
  let featureId: string = '';
  if (level === FeatureLevel.Region) {
    // Region
    featureId = feature?.id?.toString().slice(-2) || '';
  } else if (level === FeatureLevel.Department) {
    // Department
    featureId = feature?.properties?.code || '';
  } else if (level === FeatureLevel.Commune) {
    // Commune
    featureId = feature.properties.code || '';
  }

  const isAlreadyFetched = fetchedCodes.has(featureId);
  const isInCache = cacheRef.current.find((item) => item.code_insee === featureId);

  if (!isInCache && featureId && !isAlreadyFetched) {
    pushCodesToFetch(featureId);
  }
};

export default getCodesToFetch;
