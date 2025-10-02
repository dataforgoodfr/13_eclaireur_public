import { useMemo } from 'react';

import { formatMonetaryValue, formatNumberInteger, getMonetaryUnit } from '#utils/utils';

export type ChartDataType = 'marches-publics' | 'subventions';
export type DisplayMode = 'amounts' | 'counts';

type ChartDataItem = {
  year: number;
  value: number;
};

type UseChartDataProps = {
  data: ChartDataItem[];
  chartType: ChartDataType;
  displayMode?: DisplayMode;
};

export const useChartData = ({ data, chartType, displayMode = 'amounts' }: UseChartDataProps) => {
  // Calculate values
  const allValues = useMemo(() => data.flatMap((d) => [d.value]), [data]);
  const maxValue = useMemo(() => (allValues.length > 0 ? Math.max(...allValues) : 0), [allValues]);
  const avgValue = useMemo(() => maxValue / 2, [maxValue]);

  // Determine unit and format function based on display mode
  const unit = useMemo(
    () => (displayMode === 'amounts' ? getMonetaryUnit(maxValue) : undefined),
    [displayMode, maxValue],
  );

  const formatValue = useMemo(
    () =>
      displayMode === 'counts'
        ? (value: number) => formatNumberInteger(value)
        : (value: number) => formatMonetaryValue(value, unit!),
    [displayMode, unit],
  );

  // Chart colors based on type
  const { barColor, borderColor } = useMemo(() => {
    if (chartType === 'marches-publics') {
      return {
        barColor: '#CAD2FC',
        borderColor: '#303F8D',
      };
    }
    return {
      barColor: '#FAF79E',
      borderColor: '#303F8D',
    };
  }, [chartType]);

  // Transform data for display
  const chartDataForDisplay = useMemo(
    () =>
      data.map((item) => {
        const isPrimaryMissing = !item.value || item.value === 0;
        const primaryValue = isPrimaryMissing ? avgValue : item.value;

        return {
          year: item.year,
          value: primaryValue,
          originalValue: item.value,
          isPrimaryMissing,
        };
      }),
    [data, avgValue],
  );

  return {
    allValues,
    maxValue,
    avgValue,
    unit,
    formatValue,
    barColor,
    borderColor,
    chartDataForDisplay,
  };
};
