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
import { InterpellerButton } from '../../../../components/ui/interpeller-button';
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


  if (isPending) return <ChartSkeleton />;
  if (isError) return <ErrorFetching style={{ height: CHART_HEIGHT }} />;

  return <BarChart
    data={chartData}
    barColor={config.barColor}
    borderColor={config.borderColor}
    siren={siren}
    legendLabel={config.legendLabels[displayMode]}
    chartType={chartType}
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
  siren?: string;
  legendLabel: string;
  chartType: ChartDataType;
};

function BarChart({
  data,
  barColor,
  borderColor,
  siren,
  legendLabel,
  chartType
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

  const allValues = data.flatMap(d => [d.value]);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
  const avgValue = maxValue / 2; // Average value for "Aucune donnée"

  // Process data with same logic as mobile version
  const chartDataForDisplay = data.map(item => {
    // Check if primary value is 0 or missing - show average in yellow (same as mobile)
    const isPrimaryMissing = !item.value || item.value === 0;
    const primaryValue = isPrimaryMissing ? avgValue : item.value;

    return {
      year: item.year,
      value: primaryValue,
      originalValue: item.value,
      isPrimaryMissing
    };
  });


  return (
    <div className="relative">
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
            content={() => {
              const bgColorClass = chartType === 'marches-publics' ? 'bg-primary-light' : 'bg-brand-1';
              return (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div
                    className={`w-6 h-6 rounded border border-primary ${bgColorClass}`}
                  />
                  <span className="text-primary font-semibold">{legendLabel}</span>
                </div>
              );
            }}
          />
          <Bar
            dataKey='value'
            stackId='a'
            strokeWidth={1}
            radius={[16, 0, 0, 0]}
            label={(props) => {
              const entry = chartDataForDisplay[props.index];
              if (entry?.isPrimaryMissing && siren) {
                return (
                  <g>
                    <foreignObject
                      x={props.x + props.width / 2 - 50}
                      y={props.y - 120}
                      width="100"
                      height="120"
                      style={{ pointerEvents: 'auto', zIndex: 1000 }}
                    >
                      <div className="flex flex-col items-center gap-2 pointer-events-auto">
                        <InterpellerButton siren={siren} />
                        <div className="text-lg font-semibold text-primary text-center">
                          Aucune donnée
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                );
              }
              return <g />;
            }}
          >
            {chartDataForDisplay.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isPrimaryMissing ? '#F4D93E' : barColor}
                stroke={entry.isPrimaryMissing ? '#F4D93E' : borderColor}
                strokeWidth={1}
              />
            ))}
            <LabelList
              position='top'
              formatter={(value: number) => value === avgValue ? "" : formatCompactPrice(value)}
              fill='#303F8D'
              // No border to text
              strokeWidth={0}
              fontSize="16"
              fontWeight="600"
              fontFamily="var(--font-kanit), system-ui, sans-serif"
              offset={20}
            />
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>

    </div>
  );
}