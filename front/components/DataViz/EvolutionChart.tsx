'use client';

import type { RefObject } from 'react';

import type { EvolutionTheme } from '#utils/evolutionThemes';
import { useStreamingChart } from '#utils/hooks/useStreamingChart';

import DesktopEvolutionChart from '../../app/community/[siren]/components/DesktopEvolutionChart';
import { CHART_HEIGHT } from '../../app/community/[siren]/components/constants';
import { useChartData } from '../../app/community/[siren]/components/hooks/useChartData';
import { ErrorFetching } from '../../components/ui/ErrorFetching';

export type DisplayMode = 'amounts' | 'counts';
export type ChartDataType = 'marches-publics' | 'subventions';

type EvolutionChartProps = {
  siren: string;
  displayMode: DisplayMode;
  dataType: ChartDataType;
  data: Array<{ year: number; amount?: number; count?: number }> | null | undefined;
  isPending: boolean;
  isError: boolean;
  theme: EvolutionTheme;
  ref?: RefObject<HTMLDivElement | null>;
};

export default function EvolutionChart({
  siren,
  displayMode,
  dataType,
  data,
  isPending,
  isError,
  theme,
  ref,
}: EvolutionChartProps) {
  // Use streaming chart hook for placeholder-to-real data transition
  const streamingState = useStreamingChart(data, isPending, isError, {
    chartType: dataType,
    displayMode,
  });

  // Transform streaming data to basic format for useChartData hook
  const basicChartData = streamingState.data.map((item) => ({
    year: item.year,
    value: item.value,
  }));

  // Use shared chart data logic for formatting - always call hooks
  const chartData = useChartData({ data: basicChartData, chartType: dataType });
  const { unit, formatValue, avgValue, chartDataForDisplay } = chartData;

  // Show error state only if there's an actual error
  if (isError) return <ErrorFetching style={{ height: CHART_HEIGHT }} />;

  const legendLabel = theme.legendLabels[displayMode];
  const showLegendUnit = displayMode === 'amounts';

  return (
    <DesktopEvolutionChart
      ref={ref}
      data={chartDataForDisplay}
      barColor={theme.barColor}
      borderColor={theme.borderColor}
      unit={showLegendUnit ? unit : undefined}
      formatValue={formatValue}
      avgValue={avgValue}
      legendLabel={legendLabel}
      chartType={dataType}
      siren={siren}
      hasRealData={streamingState.hasRealData}
    />
  );
}
