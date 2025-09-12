/**
 * Utility functions to generate placeholder data for charts
 * Shows chart structure without displaying actual numbers until real data loads
 */

export type PlaceholderBarData = {
  year: number;
  value: null; // No actual value to avoid showing fake numbers
  displayHeight: number; // For visual proportional display
};

/**
 * Generates placeholder data for yearly bar charts
 * Creates visually appealing bar heights without actual values
 */
export function generateYearlyPlaceholderData(): PlaceholderBarData[] {
  const currentYear = new Date().getFullYear();
  const data: PlaceholderBarData[] = [];

  // Heights that create a natural-looking progression
  // Varying heights to avoid monotony while looking realistic
  const baseHeights = [45, 65, 55, 85, 70, 90, 75, 60];

  for (let i = 0; i <= 7; i++) {
    const year = currentYear - 7 + i;
    data.push({
      year,
      value: null, // No fake values displayed
      displayHeight: baseHeights[i],
    });
  }

  return data;
}

/**
 * Transforms placeholder data to format expected by chart components
 * Maintains compatibility with existing chart data structure
 */
export function transformPlaceholderForChart(placeholderData: PlaceholderBarData[]) {
  return placeholderData.map((item) => ({
    year: item.year,
    value: 0, // Use 0 for chart rendering but hide labels
  }));
}

/**
 * Generates different placeholder patterns based on chart type
 */
export function generatePlaceholderByType(chartType: 'subventions' | 'marches-publics') {
  const basePlaceholder = generateYearlyPlaceholderData();

  switch (chartType) {
    case 'subventions':
      // Subventions typically have gradual growth pattern
      return basePlaceholder.map((item, index) => ({
        ...item,
        displayHeight: Math.max(40, 50 + index * 8 + Math.sin(index) * 15),
      }));

    case 'marches-publics':
      // Marchés publics might have more variation
      return basePlaceholder.map((item, index) => ({
        ...item,
        displayHeight: Math.max(35, 60 + Math.cos(index) * 25 + (index % 2) * 20),
      }));

    default:
      return basePlaceholder;
  }
}

/**
 * Check if data contains real values (not placeholder)
 */
export function hasRealData(
  data: Array<{ value?: number; amount?: number; count?: number }> | null | undefined,
): boolean {
  if (!data || data.length === 0) return false;

  // Check if data has actual values (non-zero or non-null)
  return data.some(
    (item) =>
      (item.value && item.value > 0) ||
      (item.amount && item.amount > 0) ||
      (item.count && item.count > 0),
  );
}

/**
 * Check if comparison data contains real values (not all missing)
 */
export function hasRealComparisonData(
  data:
    | Array<{
        community: number;
        regional: number;
        communityMissing?: boolean;
        regionalMissing?: boolean;
      }>
    | null
    | undefined,
): boolean {
  if (!data || data.length === 0) return false;

  // Check if at least some data points have real values (not missing)
  return data.some(
    (item) =>
      (!item.communityMissing && item.community > 0) ||
      (!item.regionalMissing && item.regional > 0),
  );
}

/**
 * Smooth transition between placeholder and real data
 * Ensures consistent year structure
 */
export function mergeWithRealData(
  placeholderData: PlaceholderBarData[],
  realData: Array<{ year: number; amount?: number; count?: number }> | null | undefined,
  displayMode: 'amounts' | 'counts',
) {
  if (!realData || realData.length === 0) {
    return transformPlaceholderForChart(placeholderData);
  }

  return placeholderData.map((placeholder) => {
    const realItem = realData.find((item) => item.year === placeholder.year);
    if (realItem) {
      const value = displayMode === 'amounts' ? realItem.amount : realItem.count;
      return {
        year: placeholder.year,
        value: value || 0,
      };
    }
    return {
      year: placeholder.year,
      value: 0,
    };
  });
}
