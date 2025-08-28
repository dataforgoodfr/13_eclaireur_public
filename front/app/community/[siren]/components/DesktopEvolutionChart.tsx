'use client';

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
  unit: string;
  formatValue: (value: number) => string;
  avgValue: number;
  legendLabel: string;
  chartType: ChartDataType;
  siren?: string;
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
}: DesktopEvolutionChartProps) {
  return (
    <div className='relative'>
      <ResponsiveContainer width='100%' height={CHART_HEIGHT}>
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
          <XAxis dataKey='year' axisLine={true} tickLine={true} />
          <YAxis tickFormatter={(value) => formatValue(value)} />
          <Legend
            content={() => {
              const bgColorClass =
                chartType === 'marches-publics' ? 'bg-primary-light' : 'bg-brand-2';
              return (
                <div className='mt-4 flex flex-col items-center gap-2'>
                  <div className='flex items-center gap-2'>
                    <div className={`h-6 w-6 rounded border border-primary ${bgColorClass}`} />
                    <span className='font-semibold text-primary'>{legendLabel}</span>
                  </div>
                  <div className='text-xs font-medium text-primary'>
                    Montants exprimés en {unit}
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
              if (entry?.isPrimaryMissing && siren) {
                return (
                  <g>
                    <foreignObject
                      x={props.x + props.width / 2 - 50}
                      y={props.y - 120}
                      width='100'
                      height='120'
                      style={{ pointerEvents: 'auto', zIndex: 1000 }}
                    >
                      <div className='pointer-events-auto flex flex-col items-center gap-2'>
                        <InterpellerButton siren={siren} />
                        <div className='text-center text-lg font-semibold text-primary'>
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
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.year}`}
                fill={entry.isPrimaryMissing ? '#F4D93E' : barColor}
                // darker
                stroke={entry.isPrimaryMissing ? '#F4D93E' : borderColor}
                strokeWidth={1}
                strokeOpacity={entry.isPrimaryMissing ? 0 : 1}
              />
            ))}
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
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
