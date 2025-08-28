'use client';

import { useEffect, useMemo, useState } from 'react';

import { ErrorFetching } from '../../../../components/ui/ErrorFetching';
import ChartSkeleton from './ChartSkeleton';
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
}: EvolutionChartProps) {
  const config = CHART_CONFIG[chartType];
  const isAmountsMode = displayMode === 'amounts';

  // Memoize chart data to avoid recalculations and flashing
  const chartData = useMemo(() => {
    const initialList: BarChartData = [];
    for (let i = 0; i <= 7; i++) {
      initialList.push({
        year: new Date(Date.now()).getFullYear() - 7 + i,
        value: 0,
      });
    }

    return initialList.map((el) => {
      const found = data?.find((item) => item.year === el.year);
      const value = isAmountsMode ? (found?.amount ?? el.value) : (found?.count ?? el.value);
      return { ...el, value };
    });
  }, [data, isAmountsMode]);

  if (isPending) return <ChartSkeleton />;
  if (isError) return <ErrorFetching style={{ height: CHART_HEIGHT }} />;

  return (
    <BarChart
      data={chartData}
      barColor={config.barColor}
      borderColor={config.borderColor}
      siren={siren}
      legendLabel={config.legendLabels[displayMode]}
      chartType={chartType}
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
};

function BarChart({ data, barColor, borderColor, siren, legendLabel, chartType }: BarChartProps) {
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
      />
    );
  }

  // Pour desktop : graphique vertical
  return (
    <DesktopEvolutionChart
      data={chartDataForDisplay}
      barColor={barColor}
      borderColor={borderColor}
      unit={unit}
      formatValue={formatValue}
      avgValue={avgValue}
      legendLabel={legendLabel}
      chartType={chartType}
      siren={siren}
    />
  );
}
