'use client';

import { RefObject, useEffect, useState } from 'react';

import { useStreamingChart } from '#utils/hooks/useStreamingChart';

import { ErrorFetching } from '../../../../components/ui/ErrorFetching';
import DesktopEvolutionChart from './DesktopEvolutionChart';
import MobileChart from './MobileChart';
import { CHART_HEIGHT } from './constants';
import { type ChartDataType, useChartData } from './hooks/useChartData';

export type DisplayMode = 'amounts' | 'counts';

type EvolutionChartProps = {
  siren: string;
  displayMode: DisplayMode;
  chartType: ChartDataType;
  data: Array<{ year: number; amount?: number; count?: number }> | null | undefined;
  isPending: boolean;
  isError: boolean;
  ref?: RefObject<HTMLDivElement | null>;
};

const CHART_CONFIG = {
  'marches-publics': {
    barColor: '#CAD2FC', // score-transparence mp (brand-2)
    borderColor: '#303F8D',
    legendLabels: {
      amounts: 'Montant des marchés publics publiés',
      counts: 'Nombre de marchés publics publiées',
    },
  },
  subventions: {
    barColor: '#E8F787', // score-transparence subvention (brand-2)
    borderColor: '#303F8D',
    legendLabels: {
      amounts: 'Montant des subventions publiées',
      counts: 'Nombre de subventions publiées',
    },
  },
};

export function EvolutionChart({
  siren,
  displayMode,
  chartType,
  data,
  isPending,
  isError,
  ref,
}: EvolutionChartProps) {
  const config = CHART_CONFIG[chartType];

  // Use streaming chart hook for placeholder-to-real data transition
  const streamingState = useStreamingChart(data, isPending, isError, {
    chartType,
    displayMode,
  });

  // Show error state only if there's an actual error
  if (isError) return <ErrorFetching style={{ height: CHART_HEIGHT }} />;

  return (
    <BarChart
      ref={ref}
      data={streamingState.data}
      barColor={config.barColor}
      borderColor={config.borderColor}
      siren={siren}
      legendLabel={config.legendLabels[displayMode]}
      chartType={chartType}
      hasRealData={streamingState.hasRealData}
    />
  );
}

type BarChartData = {
  year: number;
  value: number;
}[];

type BarChartProps = {
  data: BarChartData;
  barColor: string;
  borderColor: string;
  siren?: string;
  legendLabel: string;
  chartType: ChartDataType;
  hasRealData: boolean;
  ref?: RefObject<HTMLDivElement | null>;
};

function BarChart({
  data,
  barColor,
  borderColor,
  siren,
  legendLabel,
  chartType,
  hasRealData,
  ref,
}: BarChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Use shared chart data logic
  const chartData = useChartData({ data, chartType });
  const { unit, formatValue, avgValue, chartDataForDisplay } = chartData;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Pour mobile : utiliser le nouveau composant MobileChart
  if (isMobile) {
    // Transform data for MobileChart format
    const mobileChartData = data.map((item) => ({
      year: item.year,
      primary: item.value,
    }));

    return (
      <MobileChart
        data={mobileChartData}
        mode='single'
        primaryColor={barColor}
        formatValue={formatValue}
        legendLabel={legendLabel}
        labelColor='#303F8D'
        siren={siren}
        unitLabel={unit}
        hasRealData={hasRealData}
      />
    );
  }

  // Pour desktop : graphique vertical
  return (
    <DesktopEvolutionChart
      ref={ref}
      data={chartDataForDisplay}
      barColor={barColor}
      borderColor={borderColor}
      unit={unit}
      formatValue={formatValue}
      avgValue={avgValue}
      legendLabel={legendLabel}
      chartType={chartType}
      siren={siren}
      hasRealData={hasRealData}
    />
  );
}
