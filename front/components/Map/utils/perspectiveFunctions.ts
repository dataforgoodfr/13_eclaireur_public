import { CollectiviteMinMax } from '../types';

// Move this function outside the component, before the MapLayout component
export const getMinMaxForAdminLevel = (
  minMaxValues: CollectiviteMinMax[],
  currentLevel: string,
) => {
  const data = minMaxValues.find((item) => item.type === currentLevel);
  return {
    min: data?.min_population || 0,
    max: data?.max_population || 1000000,
  };
};

// Move this function outside the component as well
export const createInitialRanges = (
  populationMin: number,
  populationMax: number,
): Record<string, [number, number]> => {
  return {
    population: [populationMin, populationMax],
    density: [0, 500],
    'total-budget': [0, 10000000],
    'budget-per-capita': [0, 5000],
  };
};
