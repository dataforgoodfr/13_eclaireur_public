'use client';

import { formatCompactPrice } from '#utils/utils';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  Cell,
  LabelList,
  Legend,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import ChartSkeleton from './ChartSkeleton';

import { ErrorFetching } from '../../../../components/ui/ErrorFetching';
import MobileChart from './MobileChart';
import { CHART_HEIGHT } from './constants';

export type ChartDataType = 'marches-publics' | 'subventions';
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
      amounts: 'Montant des marchés publics publiées (€)',
      counts: 'Nombre de marchés publics publiées',
    },
  },
  'subventions': {
    barColor: '#FAF79E', // score-transparence subvention (brand-1)
    borderColor: '#303F8D',
    legendLabels: {
      amounts: 'Montant des subventions publiées (€)',
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
  isError
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
      const value = isAmountsMode
        ? found?.amount ?? el.value
        : found?.count ?? el.value;
      return { ...el, value };
    });
  }, [data, isAmountsMode]);

  // Check if all data is zero (no data state)
  const hasNoData = useMemo(() =>
    !data || data.length === 0 || chartData.every(item => item.value === 0),
    [data, chartData]
  );

  if (isPending) return <ChartSkeleton />;
  if (isError) return <ErrorFetching style={{ height: CHART_HEIGHT }} />;

  return <BarChart
    data={chartData}
    barColor={config.barColor}
    borderColor={config.borderColor}
    hasNoData={hasNoData}
    siren={siren}
    legendLabel={config.legendLabels[displayMode]}
  />;
}

function formatLabel(value: number): string {
  if (value === 0) return 'Aucunes données publiées';
  return formatCompactPrice(value);
}

type BarChartData = {
  year: number;
  value: number;
}[];

type BarChartProps = {
  data: BarChartData;
  barColor: string;
  borderColor: string;
  hasNoData: boolean;
  siren?: string;
  legendLabel: string;
};

function BarChart({
  data,
  barColor,
  borderColor,
  hasNoData,
  siren,
  legendLabel
}: BarChartProps) {
  const [isMobile, setIsMobile] = useState(false);

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
    const mobileChartData = data.map(item => ({
      year: item.year,
      primary: item.value,
    }));

    return (
      <MobileChart
        data={mobileChartData}
        mode="single"
        primaryColor={barColor}
        formatValue={formatLabel}
        legendLabel={legendLabel}
        labelColor="#303F8D"
        siren={siren}
      />
    );
  }

  // Pour desktop : graphique vertical
  // Calculate average value like mobile version (maxValue / 2)
  const allValues = data?.flatMap(item => item.value > 0 ? [item.value] : []) || [];
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
  const avgValue = maxValue > 0 ? maxValue / 2 : 1000000; // Use a visible value when no data

  // Replace individual zero values with avgValue (like mobile does)
  const chartDataForDisplay = data.map(item => ({
    year: item.year,
    value: item.value === 0 ? avgValue : item.value
  }));

  return (
    <ResponsiveContainer width='100%' height={CHART_HEIGHT}>
      <RechartsBarChart
        width={500}
        height={300}
        data={chartDataForDisplay}
        margin={{
          top: 30,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey='year' axisLine={true} tickLine={true} />
        <YAxis tickFormatter={(value) => formatCompactPrice(value)} />
        <Legend
          formatter={() => <span className='text-primary'>{legendLabel}</span>}
          wrapperStyle={{
            color: '#000000 !important',
            fontWeight: 600
          }}
          iconType="rect"
          iconSize={24}
        />
        <Bar
          dataKey='value'
          stackId='a'
          strokeWidth={1}
          radius={[16, 0, 0, 0]}
        >
          {chartDataForDisplay.map((entry, index) => {
            const originalItem = data.find(item => item.year === entry.year);
            const isNoData = originalItem?.value === 0;
            return (
              <Cell 
                key={`cell-${index}`} 
                fill={isNoData ? '#F4D93E' : barColor}
                stroke={isNoData ? '#E5C72E' : borderColor}
              />
            );
          })}
          <LabelList
            position='top'
            formatter={(value, name, props) => {
              if (!props?.payload?.year) return formatLabel(value);
              const originalItem = data.find(item => item.year === props.payload.year);
              return originalItem?.value === 0 ? 'Aucune donnée' : formatLabel(value);
            }}
            fill='#303F8D'
            fontSize="16"
            fontWeight="600"
            fontFamily="var(--font-kanit), system-ui, sans-serif"
            offset={10}
          />
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}