import { FeatureLevel } from '../types';

// functions for combining datasets
const extractFeaturesByLevel = (features: any[]) => {
  const regions = features.filter((feature) => feature.properties.level === FeatureLevel.Region);
  const departments = features.filter(
    (feature) => feature.properties.level === FeatureLevel.Department,
  );
  const communes = features.filter((feature) => feature.properties.level === FeatureLevel.Commune);

  return { regions, departments, communes };
};

export default extractFeaturesByLevel;
