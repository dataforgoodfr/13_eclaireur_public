import { useMemo } from 'react';

import { formatMonetaryValue, getMonetaryUnit } from '#utils/utils';

export type ChartDataType = 'marches-publics' | 'subventions';

type ChartDataItem = {
  year: number;
  value: number;
};

type UseChartDataProps = {
  data: ChartDataItem[];
  chartType: ChartDataType;
};

export const useChartData = ({ data, chartType }: UseChartDataProps) => {
  // Calculate values
  const allValues = useMemo(() => data.flatMap((d) => [d.value]), [data]);
  const maxValue = useMemo(() => (allValues.length > 0 ? Math.max(...allValues) : 0), [allValues]);
  const avgValue = useMemo(() => maxValue / 2, [maxValue]);

  // Determine unit and format function
  const unit = useMemo(() => getMonetaryUnit(maxValue), [maxValue]);
  const formatValue = useMemo(() => (value: number) => formatMonetaryValue(value, unit), [unit]);

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
