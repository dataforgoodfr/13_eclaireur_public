'use client';

import { InterpellerButton } from '#components/ui/interpeller-button';
import { formatCompactPrice } from '#utils/utils';
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// Common data structure for both evolution and comparison
type MobileChartData = {
  year: string | number;
  primary: number;
  primaryLabel?: string;
  secondary?: number;
  secondaryLabel?: string;
  isPrimaryMissing: boolean;
  isSecondaryMissing?: boolean;
};

type MobileChartProps = {
  data: MobileChartData[];
  primaryColor?: string;
  secondaryColor?: string;
  mode?: 'single' | 'dual'; // single for evolution, dual for comparison
  formatValue?: (value: number) => string;
  legendLabel?: string;
  secondaryLabel?: string;
  labelColor?: string;
  siren?: string; // For interpeller button
  unitLabel?: string; // Unit label like "M€" or "k€"
  hasRealData?: boolean; // Whether to show actual values or placeholder
  dataLoading?: boolean;
};

// Loading overlay component
const LoadingOverlay = () => (
  <div className='absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70'>
    <div className='flex items-center gap-2 text-primary'>
      <div className='h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent' />
      <span>Mise à jour des données...</span>
    </div>
  </div>
);

export default function MobileChart({
  data: incomingData,
  primaryColor = '#303F8D',
  secondaryColor = 'url(#stripes)',
  mode = 'single',
  secondaryLabel,
  formatValue = formatCompactPrice,
  legendLabel = '',
  labelColor = '#303F8D',
  siren,
  unitLabel,
  hasRealData = true,
  dataLoading = false,
}: MobileChartProps) {
  if (!incomingData || incomingData.length === 0) {
    return <div className='p-4 text-center text-gray-500'>Aucune donnée disponible</div>;
  }

  // Calculate the maximum value across all data to normalize bar sizes
  const allValues = incomingData.flatMap((d) =>
    mode === 'dual' && d.secondary !== undefined ? [d.primary, d.secondary] : [d.primary],
  );
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
  const noDataValue = (5 * maxValue) / 6; // Average value for "Aucune donnée"
  const data = incomingData.map((item) => ({
    ...item,
    primary: item.primary || noDataValue,
    secondary: item.secondary || noDataValue,
  }));
  const nbData = data.length;

  return (
    <>
      {dataLoading && <LoadingOverlay />}
      {!hasRealData && (
        <div className='absolute right-2 top-2 z-10'>
          <div className='h-2 w-2 animate-pulse rounded-full bg-gray-400' />
        </div>
      )}

      <div className='overflow-hidden'>
        <ResponsiveContainer width='100%' height={40 + 60 * nbData}>
          <BarChart
            data={data}
            layout='vertical'
            margin={{ left: 0, right: 120, top: 0, bottom: 0 }}
            barGap={4}
          >
            <XAxis
              type='number'
              tickFormatter={(value) => formatValue(value)}
              domain={[0, 'dataMax']}
              axisLine={false}
              tickLine={false}
              hide
            />
            <YAxis type='category' dataKey='year' axisLine={false} tickLine={false} width={50} />
            {/* Primary bar */}
            <Bar
              dataKey='primary'
              barSize={mode === 'single' ? 40 : 24}
              radius={[0, 0, 16, 0]}
              label={(props) => {
                const entry = data[props.index];
                if (entry.isPrimaryMissing && siren && mode === 'single') {
                  return (
                    <g>
                      <foreignObject
                        x={props.x + props.width}
                        y={props.y - 5}
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
              {data.map((item) => {
                const isPrimaryMissing = item.isPrimaryMissing;

                return (
                  <Cell
                    key={`cell-${item.year}`}
                    fill={isPrimaryMissing ? '#F4D93E' : primaryColor}
                    fillOpacity={hasRealData ? 1 : 0.7}
                    strokeOpacity={hasRealData ? 1 : 0.7}
                    stroke={isPrimaryMissing ? '#E5C72E' : '#303F8D'}
                    strokeWidth={1}
                    radius={[0, 0, 16, 0] as unknown as number}
                  />
                );
              })}
              {/* Only show label if not showing interpeller button */}
              {hasRealData && (
                <LabelList
                  dataKey='primary'
                  position='right'
                  formatter={(value: number) => (value === noDataValue ? '' : formatValue(value))}
                  style={{
                    fontSize: '24px',
                    fill: labelColor,
                    fontWeight: '700',
                    fontFamily: 'var(--font-kanit)',
                    stroke: 'none',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                />
              )}
              {/* Shows no data published label */}
              {hasRealData && (
                <LabelList
                  dataKey='isPrimaryMissing'
                  position='insideLeft'
                  formatter={(value: boolean) => (value ? 'Aucune\u00A0donnée publiée' : '')}
                  fill='#303F8D'
                  strokeWidth={0}
                  fontSize='15'
                  fontWeight='600'
                  fontFamily='var(--font-kanit), system-ui, sans-serif'
                  offset={20}
                />
              )}
            </Bar>
            {mode === 'dual' && (
              <Bar dataKey='secondary' barSize={24} radius={[0, 0, 16, 0]}>
                {/* Secondary data */}
                {data.map((item) => {
                  const isSecondaryMissing = item.isSecondaryMissing;

                  if (item.secondary === undefined) return null;

                  return (
                    <Cell
                      key={`cell-${item.year}`}
                      fill={isSecondaryMissing ? '#F4D93E' : secondaryColor}
                      stroke={isSecondaryMissing ? '#E5C72E' : ''}
                      strokeWidth={1}
                      strokeLinecap='round'
                      fillOpacity={hasRealData ? 1 : 0.7}
                      strokeOpacity={hasRealData ? 1 : 0.7}
                    />
                  );
                })}
                {hasRealData && (
                  <LabelList
                    dataKey='secondary'
                    position='right'
                    formatter={(value: number) => (value === noDataValue ? '' : formatValue(value))}
                    style={{
                      fontSize: '24px',
                      fill: labelColor,
                      fontWeight: '700',
                      fontFamily: 'var(--font-kanit)',
                      stroke: 'none',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  />
                )}
                {hasRealData && (
                  <LabelList
                    dataKey='isSecondaryMissing'
                    position='insideLeft'
                    formatter={(value: boolean) => (value ? 'Aucune\u00A0donnée publiée' : '')}
                    fill='#303F8D'
                    strokeWidth={0}
                    fontSize='15'
                    fontWeight='600'
                    fontFamily='var(--font-kanit), system-ui, sans-serif'
                    offset={20}
                  />
                )}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SVG pattern for stripes (used in dual mode) */}
      <svg width='0' height='0'>
        <defs>
          <pattern
            id='stripes'
            patternUnits='userSpaceOnUse'
            width='6'
            height='8'
            patternTransform='rotate(45)'
          >
            <rect width='1.5' height='8' fill='#303F8D' />
            <rect x='4' width='2' height='8' fill='white' />
          </pattern>
        </defs>
      </svg>
      {legendLabel && (
        <div className='mt-4 flex flex-col items-start gap-2 px-4 md:items-center'>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 rounded-sm' style={{ backgroundColor: primaryColor }} />
            <div className='text-sm font-medium' style={{ color: labelColor }}>
              {legendLabel} {unitLabel ? `(${unitLabel})` : ''}
            </div>
          </div>
          {secondaryLabel && (
            <div className='flex items-center gap-2'>
              <svg width='16' height='16'>
                <rect width='16' height='16' rx='3' fill={secondaryColor} />
              </svg>
              <div className='text-sm font-medium' style={{ color: labelColor }}>
                {secondaryLabel}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
