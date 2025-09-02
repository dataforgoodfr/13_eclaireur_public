'use client';

import { RefObject } from 'react';

import {
  Bar,
  Cell,
  LabelList,
  Legend,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { InterpellerButton } from '../../../../components/ui/interpeller-button';
import { CHART_HEIGHT } from './constants';
import type { ChartDataType } from './hooks/useChartData';

type DesktopEvolutionChartProps = {
  data: Array<{
    year: number;
    value: number;
    originalValue: number;
    isPrimaryMissing: boolean;
  }>;
  barColor: string;
  borderColor: string;
  unit?: string;
  formatValue: (value: number) => string;
  avgValue: number;
  legendLabel: string;
  chartType: ChartDataType;
  siren?: string;
  hasRealData: boolean;
  ref?: RefObject<HTMLDivElement | null>;
};

export default function DesktopEvolutionChart({
  data,
  barColor,
  borderColor,
  unit,
  formatValue,
  avgValue,
  legendLabel,
  chartType,
  siren,
  hasRealData,
  ref,
}: DesktopEvolutionChartProps) {
  return (
    <div className='relative'>
      {!hasRealData && (
        <div className='absolute right-2 top-2 z-10'>
          <div className='h-2 w-2 animate-pulse rounded-full bg-gray-400' />
        </div>
      )}
      <ResponsiveContainer ref={ref} width='100%' height={CHART_HEIGHT}>
        <RechartsBarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 30,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <Legend
            content={() => {
              const bgColorClass =
                chartType === 'marches-publics' ? 'bg-primary-light' : 'bg-brand-2';
              return (
                <div className='mt-4 flex flex-col items-center gap-2'>
                  <div className='flex items-center gap-2'>
                    <div className={`h-6 w-6 rounded border border-primary ${bgColorClass}`} />
                    <span className='font-semibold text-primary'>
                      {legendLabel} {unit ? `(${unit})` : ''}
                    </span>
                  </div>
                </div>
              );
            }}
          />
          <Bar
            dataKey='value'
            stackId='a'
            strokeWidth={1}
            radius={[16, 0, 0, 0]}
            style={{ zIndex: 1 }}
            label={(props) => {
              const entry = data[props.index];
              if (entry?.isPrimaryMissing && siren && hasRealData) {
                return (
                  <g>
                    <foreignObject
                      x={props.x + props.width / 2 - 50}
                      y={props.y - 60}
                      width='100'
                      height='120'
                      style={{ pointerEvents: 'auto', zIndex: 1000 }}
                    >
                      <div className='pointer-events-auto flex flex-col items-center gap-2'>
                        <InterpellerButton siren={siren} />
                      </div>
                    </foreignObject>
                  </g>
                );
              }
              return <g />;
            }}
          >
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.year}`}
                fill={entry.isPrimaryMissing ? '#F4D93E' : barColor}
                stroke={entry.isPrimaryMissing ? '#F4D93E' : borderColor}
                strokeWidth={1}
                strokeOpacity={entry.isPrimaryMissing ? 0 : hasRealData ? 1 : 0.7}
                fillOpacity={hasRealData ? 1 : 0.7}
              />
            ))}
            {hasRealData && (
              <LabelList
                dataKey='isPrimaryMissing'
                position='inside'
                formatter={(isPrimaryMissing: boolean) =>
                  isPrimaryMissing ? 'Aucune donnée publiée' : ''
                }
                fill='#303F8D'
                strokeWidth={0}
                fontSize='16'
                fontWeight='600'
                fontFamily='var(--font-kanit), system-ui, sans-serif'
                offset={20}
              />
            )}
            {hasRealData && (
              <LabelList
                position='top'
                formatter={(value: number) => (value === avgValue ? '' : formatValue(value))}
                fill='#303F8D'
                strokeWidth={0}
                fontSize='16'
                fontWeight='600'
                fontFamily='var(--font-kanit), system-ui, sans-serif'
                offset={20}
              />
            )}
          </Bar>
          <XAxis dataKey='year' axisLine tickLine />
          <YAxis tickFormatter={hasRealData ? (value) => formatValue(value) : () => ''} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
