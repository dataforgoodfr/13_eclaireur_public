import { TerritoryLevel } from '../types';

// functions for combining datasets
const extractFeaturesByLevel = (features: any[]) => {
  const regions = features.filter((feature) => feature.properties.level === TerritoryLevel.Region);
  const departments = features.filter(
    (feature) => feature.properties.level === TerritoryLevel.Department,
  );
  const communes = features.filter((feature) => feature.properties.level === TerritoryLevel.Commune);

  return { regions, departments, communes };
};

export default extractFeaturesByLevel;
