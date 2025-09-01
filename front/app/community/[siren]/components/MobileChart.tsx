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
};

type MobileChartProps = {
  data: MobileChartData[];
  primaryColor?: string;
  secondaryColor?: string;
  mode?: 'single' | 'dual'; // single for evolution, dual for comparison
  formatValue?: (value: number) => string;
  legendLabel?: string;
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
  data,
  primaryColor = '#303F8D',
  secondaryColor = 'url(#stripes)',
  mode = 'single',
  formatValue = formatCompactPrice,
  legendLabel = '',
  labelColor = '#303F8D',
  siren,
  unitLabel,
  hasRealData = true,
  dataLoading = false,
}: MobileChartProps) {
  if (!data || data.length === 0) {
    return <div className='p-4 text-center text-gray-500'>Aucune donnée disponible</div>;
  }

  // Calculate the maximum value across all data to normalize bar sizes
  const allValues = data.flatMap((d) =>
    mode === 'dual' && d.secondary !== undefined ? [d.primary, d.secondary] : [d.primary],
  );
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
  const chartMax = Math.round(maxValue * 1.1); // Add 10% padding
  const avgValue = maxValue / 2; // Average value for "Aucune donnée"

  return (
    <>
      {dataLoading && <LoadingOverlay />}
      {!hasRealData && (
        <div className='absolute right-2 top-2 z-10'>
          <div className='h-2 w-2 animate-pulse rounded-full bg-gray-400' />
        </div>
      )}

      {data.map((item) => {
        // Check if primary value is 0 or missing - show average in yellow
        const isPrimaryMissing = !item.primary || item.primary === 0;
        const primaryValue = isPrimaryMissing ? avgValue : item.primary;
        const primaryFillColor = isPrimaryMissing ? '#F4D93E' : primaryColor;

        // Check if secondary value is 0 or missing - show average in yellow
        const isSecondaryMissing = mode === 'dual' && (!item.secondary || item.secondary === 0);
        const secondaryValue = isSecondaryMissing ? avgValue : item.secondary;
        const secondaryFillColor = isSecondaryMissing ? '#F4D93E' : secondaryColor;

        return (
          <div
            key={item.year}
            className='flex min-w-0 items-center gap-2 py-1'
            style={{ height: '60px' }}
          >
            <div className='w-10 flex-shrink-0 text-sm font-medium text-muted'>{item.year}</div>
            <div className='relative flex-1'>
              <ResponsiveContainer width='100%' height={50}>
                <BarChart
                  data={[
                    {
                      ...item,
                      primary: primaryValue,
                      secondary: secondaryValue,
                    },
                  ]}
                  layout='vertical'
                  margin={{ left: 0, right: 60, top: 0, bottom: 0 }}
                >
                  <XAxis hide type='number' domain={[0, chartMax]} />
                  <YAxis hide type='category' />
                  {/* <Legend
                                            formatter={() => <span className='text-primary'>{legendLabel}</span>}
                                            wrapperStyle={{
                                                color: '#000000 !important',
                                                fontWeight: 600
                                            }}
                                            iconType="rect"
                                            iconSize={24}
                                        /> */}
                  {/* Primary bar */}
                  <Bar dataKey='primary' barSize={40} radius={[0, 0, 16, 0]}>
                    <Cell
                      fill={primaryFillColor}
                      fillOpacity={hasRealData ? 1 : 0.7}
                      stroke={isPrimaryMissing ? '#E5C72E' : '#303F8D'}
                      strokeWidth={1}
                      strokeOpacity={hasRealData ? 1 : 0.7}
                      radius={[0, 0, 16, 0] as unknown as number}
                    />
                    {/* Only show label if not showing interpeller button and has real data */}
                    {!(mode === 'single' && isPrimaryMissing && siren) && hasRealData && (
                      <LabelList
                        dataKey='primary'
                        position='right'
                        formatter={(value: number) =>
                          isPrimaryMissing ? 'Aucune donnée' : formatValue(value)
                        }
                        style={{
                          fontSize: isPrimaryMissing ? '14px' : '24px',
                          fill: labelColor,
                          fontWeight: isPrimaryMissing ? '600' : '700',
                          fontFamily: 'var(--font-kanit)',
                          stroke: 'none',
                          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        }}
                      />
                    )}
                  </Bar>

                  {/* Secondary bar (only in dual mode) */}
                  {mode === 'dual' && item.secondary !== undefined && (
                    <Bar dataKey='secondary' barSize={40} radius={[0, 0, 4, 0]} y={40}>
                      <Cell
                        fill={secondaryFillColor}
                        fillOpacity={hasRealData ? 1 : 0.7}
                        stroke={isSecondaryMissing ? '#E5C72E' : '#E5E7EB'}
                        strokeWidth={1}
                        strokeOpacity={hasRealData ? 1 : 0.7}
                      />
                      {hasRealData && (
                        <LabelList
                          dataKey='secondary'
                          position='right'
                          formatter={(value: number) =>
                            isSecondaryMissing ? 'Aucune donnée' : formatValue(value)
                          }
                          style={{
                            fontSize: isSecondaryMissing ? '14px' : '24px',
                            fill: labelColor,
                            fontWeight: isSecondaryMissing ? '600' : '700',
                            fontFamily: 'var(--font-kanit)',
                            stroke: 'none',
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          }}
                        />
                      )}
                    </Bar>
                  )}
                </BarChart>
              </ResponsiveContainer>

              {/* Show interpeller button and text for missing data (only with real data) */}
              {mode === 'single' && isPrimaryMissing && siren && hasRealData && (
                <div className='absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2'>
                  <div className='max-w-20 text-base font-semibold text-primary'>Aucune donnée</div>
                  <InterpellerButton siren={siren} />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* SVG pattern for stripes (used in dual mode) */}
      <svg width='0' height='0'>
        <defs>
          <pattern
            id='stripes'
            patternUnits='userSpaceOnUse'
            width='8'
            height='8'
            patternTransform='rotate(45)'
          >
            <rect width='4' height='8' fill='#303F8D' />
            <rect x='4' width='4' height='8' fill='white' />
          </pattern>
        </defs>
      </svg>
      {legendLabel && (
        <div className='mt-4 flex flex-col items-center gap-2 px-4'>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 rounded-sm' style={{ backgroundColor: primaryColor }} />
            <div className='text-sm font-medium' style={{ color: labelColor }}>
              {legendLabel}
            </div>
          </div>
          {unitLabel && (
            <div className='text-xs font-medium text-primary'>Montants exprimés en {unitLabel}</div>
          )}
        </div>
      )}
    </>
  );
}
