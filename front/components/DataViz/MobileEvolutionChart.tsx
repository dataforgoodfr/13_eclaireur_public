'use client';

import type { RefObject } from 'react';

import type { EvolutionTheme } from '#utils/evolutionThemes';
import { useStreamingChart } from '#utils/hooks/useStreamingChart';

import MobileChart from '../../app/community/[siren]/components/MobileChart';
import { CHART_HEIGHT } from '../../app/community/[siren]/components/constants';
import { useChartData } from '../../app/community/[siren]/components/hooks/useChartData';
import { ErrorFetching } from '../../components/ui/ErrorFetching';

export type DisplayMode = 'amounts' | 'counts';
export type ChartDataType = 'marches-publics' | 'subventions';

type MobileEvolutionChartProps = {
  siren: string;
  displayMode: DisplayMode;
  dataType: ChartDataType;
  data: Array<{ year: number; amount?: number; count?: number }> | null | undefined;
  isPending: boolean;
  isError: boolean;
  theme: EvolutionTheme;
  ref?: RefObject<HTMLDivElement | null>;
};

export default function MobileEvolutionChart({
  siren,
  displayMode,
  dataType,
  data,
  isPending,
  isError,
  theme,
  ref,
}: MobileEvolutionChartProps) {
  // Use streaming chart hook for placeholder-to-real data transition
  const streamingState = useStreamingChart(data, isPending, isError, {
    chartType: dataType,
    displayMode,
  });

  // Use shared chart data logic for formatting - always call hooks
  const chartData = useChartData({ data: streamingState.data, chartType: dataType, displayMode });
  const { unit, formatValue } = chartData;

  // Show error state only if there's an actual error
  if (isError) return <ErrorFetching style={{ height: CHART_HEIGHT }} />;

  const legendLabel = theme.legendLabels[displayMode];
  const showLegendUnit = displayMode === 'amounts';

  // Transform data for MobileChart format
  const mobileChartData = streamingState.data.map((item) => ({
    year: item.year,
    primary: item.value,
    isPrimaryMissing: !item.value,
  }));

  return (
    <div ref={ref}>
      <MobileChart
        data={mobileChartData}
        mode='single'
        primaryColor={theme.barColor}
        formatValue={formatValue}
        legendLabel={legendLabel}
        labelColor='#303F8D'
        siren={siren}
        unitLabel={showLegendUnit ? unit : undefined}
        hasRealData={streamingState.hasRealData}
      />
    </div>
  );
}
