/**
 * Year constants for the application
 * Update these values when transitioning to a new year
 */

/** The most recent year with complete data available */
export const CURRENT_DATA_YEAR = 2024;

/** Default year for map visualization */
export const DEFAULT_MAP_YEAR = CURRENT_DATA_YEAR;

/** Default year for API fallbacks */
export const DEFAULT_API_YEAR = 2023;

/** Year used for KPIs calculation */
export const KPI_REFERENCE_YEAR = 2024;

/** Available years for selection in map and charts */
export const AVAILABLE_YEARS = [2020, 2021, 2022, 2023, 2024] as const;

/**
 * Get the most recent year from available years
 * Useful for dynamic defaults in community pages
 */
export const getLatestAvailableYear = (years: number[]): number => {
  return years.length > 0 ? Math.max(...years) : CURRENT_DATA_YEAR;
};

/** Type for year options including 'All' */
export type YearOption = number | 'All';
