'use client';

import { InterpellerButton } from '#components/ui/interpeller-button';
import { formatCompactPrice, formatMonetaryValue, getMonetaryUnit } from '#utils/utils';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type ComparisonData = {
  year: string;
  community: number;
  communityLabel: string;
  regional: number;
  regionalLabel: string;
  communityMissing?: boolean;
  regionalMissing?: boolean;
};

export type ComparisonTheme = {
  primaryColor: string;
  secondaryColor: string;
  strokeColor: string;
};

export type ComparisonChartProps = {
  data: ComparisonData[];
  dataLoading: boolean;
  siren?: string;
  theme: ComparisonTheme;
  hasRealData?: boolean;
};

// Custom shape for community bars
const CommunityBar = (props: unknown, theme: ComparisonTheme) => {
  const { fill, x, y, width, height, payload } = props as {
    fill: string;
    x: number;
    y: number;
    width: number;
    height: number;
    payload?: { communityMissing?: boolean };
  };

  // Use yellow if data is missing
  const actualFill = payload?.communityMissing ? '#F4D93E' : fill;
  const strokeColor = payload?.communityMissing ? '#E5C72E' : theme.strokeColor;

  // Dynamic radius to prevent visual crossing issues
  const dynamicRadius = Math.min(12, height / 2);

  return (
    <path
      d={`
        M ${x + dynamicRadius} ${y}
        L ${x + width} ${y}
        L ${x + width} ${y + height}
        L ${x} ${y + height}
        L ${x} ${y + dynamicRadius}
        Q ${x} ${y} ${x + dynamicRadius} ${y}
        Z
      `}
      fill={actualFill}
      stroke={strokeColor}
      strokeWidth={1}
    />
  );
};

// Custom shape for striped bars (rayé)
const StripedBar = (props: unknown, theme: ComparisonTheme) => {
  const { x, y, width, height } = props as {
    fill: string;
    x: number;
    y: number;
    width: number;
    height: number;
    payload?: { regionalMissing?: boolean };
  };

  // Use secondary color (primary blue) even if data is missing
  const actualFill = theme.secondaryColor;
  const strokeColor = theme.secondaryColor;

  const patternId = `stripes-${x}`;

  // Dynamic radius to prevent visual crossing issues
  const dynamicRadius = Math.min(12, height / 2);

  return (
    <g>
      <defs>
        <pattern
          id={patternId}
          patternUnits='userSpaceOnUse'
          width='6'
          height='6'
          patternTransform='rotate(45)'
        >
          <rect width='2' height='6' fill={actualFill} />
          <rect x='2' width='4' height='6' fill='white' />
        </pattern>
      </defs>
      <path
        d={`
          M ${x + dynamicRadius} ${y}
          L ${x + width} ${y}
          L ${x + width} ${y + height}
          L ${x} ${y + height}
          L ${x} ${y + dynamicRadius}
          Q ${x} ${y} ${x + dynamicRadius} ${y}
          Z
        `}
        fill={`url(#${patternId})`}
        stroke={strokeColor}
        strokeWidth={1}
      />
    </g>
  );
};

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
  theme,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  theme: ComparisonTheme;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className='rounded-lg border border-gray-100 bg-white/95 p-4 shadow-xl backdrop-blur-sm'>
        <p className='mb-3 text-sm font-semibold text-gray-600'>Année {label}</p>
        <div className='space-y-2'>
          {payload.map((entry) => {
            const isStriped = entry.dataKey === 'regional';
            return (
              <div key={`${entry.dataKey}-${entry.name}`} className='flex items-center gap-3'>
                {isStriped ? (
                  <svg
                    width='16'
                    height='16'
                    className='flex-shrink-0'
                    aria-label='Pattern rayé pour moyenne régionale'
                  >
                    <title>Pattern rayé pour moyenne régionale</title>
                    <defs>
                      <pattern
                        id='tooltip-stripes'
                        patternUnits='userSpaceOnUse'
                        width='6'
                        height='6'
                        patternTransform='rotate(45)'
                      >
                        <rect width='2' height='6' fill={theme.secondaryColor} />
                        <rect x='2' width='4' height='6' fill='white' />
                      </pattern>
                    </defs>
                    <rect
                      width='16'
                      height='16'
                      fill='url(#tooltip-stripes)'
                      rx='2'
                      className='stroke-primary'
                      strokeWidth='1'
                    />
                  </svg>
                ) : (
                  <div
                    className='h-4 w-4 flex-shrink-0 rounded'
                    style={{ backgroundColor: theme.secondaryColor }}
                  />
                )}
                <div className='flex-1'>
                  <p className='text-sm text-gray-700'>{entry.name}</p>
                  <p className='text-base font-bold' style={{ color: theme.secondaryColor }}>
                    {formatCompactPrice(entry.value)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

// Loading overlay component
const LoadingOverlay = ({ theme }: { theme: ComparisonTheme }) => (
  <div className='absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70'>
    <div className='flex items-center gap-2' style={{ color: theme.secondaryColor }}>
      <div
        className='h-5 w-5 animate-spin rounded-full border-2 border-t-transparent'
        style={{ borderColor: theme.secondaryColor }}
      />
      <span>Mise à jour des données...</span>
    </div>
  </div>
);

export default function ComparisonChart({
  data,
  dataLoading,
  siren,
  theme,
  hasRealData = true,
}: ComparisonChartProps) {
  // Calculate max value for proper Y-axis scaling
  const allValues = data.flatMap((d) => [d.community, d.regional]);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;

  // Determine the appropriate unit based on max value
  const unit = getMonetaryUnit(maxValue);

  // Format function based on the chosen unit
  const formatValue = (value: number) => formatMonetaryValue(value, unit);

  // Add padding to max value to prevent bars from touching the top
  const yAxisMax = Math.round(maxValue * 1.15);

  // Use half of the largest bar height for missing data (matching Evolution charts)
  // This follows the requirement: "taille = moitié du plus grande barre"
  const avgValue = maxValue > 0 ? maxValue / 2 : 100;

  // Transform data to replace missing values with average (half of max bar)
  const transformedData = data.map((item) => ({
    ...item,
    community: item.communityMissing ? avgValue : item.community,
    regional: item.regionalMissing ? avgValue : item.regional,
  }));

  return (
    <div className='relative'>
      {dataLoading && <LoadingOverlay theme={theme} />}

      {/* Gray pulse indicator when showing placeholder data */}
      {!hasRealData && (
        <div className='absolute right-2 top-2 z-10'>
          <div className='h-2 w-2 animate-pulse rounded-full bg-gray-400' />
        </div>
      )}

      <ResponsiveContainer width='100%' height={550}>
        <BarChart
          data={transformedData}
          margin={{ top: 30, right: 5, left: 10, bottom: 10 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis dataKey='year' tick={{ fontSize: 12 }} axisLine={{ stroke: '#e5e7eb' }} />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => formatValue(value)}
            domain={[0, yAxisMax]}
          />
          <Tooltip content={<CustomTooltip theme={theme} />} />

          <Bar
            dataKey='community'
            fill={theme.primaryColor}
            name={data.length > 0 ? data[0].communityLabel : 'Budget de collectivité'}
            label={(props) => {
              const entry = transformedData[props.index];
              // Show value when community data is OK (not missing)
              if (!entry?.communityMissing) {
                return (
                  <text
                    x={props.x + props.width / 2}
                    y={props.y - 8}
                    fill={theme.secondaryColor}
                    textAnchor='middle'
                    fontSize='24'
                    fontWeight='700'
                    fontFamily='var(--font-kanit), system-ui, sans-serif'
                  >
                    {formatValue(entry.community)}
                  </text>
                );
              }
              // Show Interpeller button when any data is missing for this year
              if ((entry?.communityMissing || entry?.regionalMissing) && siren && hasRealData) {
                return (
                  <g>
                    <foreignObject
                      x={props.x + props.width / 2 - 30}
                      y={props.y - 40}
                      width='60'
                      height='120'
                      style={{ pointerEvents: 'auto', zIndex: 1000 }}
                    >
                      <div className='pointer-events-auto flex flex-col items-center gap-2'>
                        <InterpellerButton className='h-8 w-10' siren={siren} />
                      </div>
                    </foreignObject>
                  </g>
                );
              }
              return <g />;
            }}
            shape={(props: unknown) => CommunityBar(props, theme)}
          >
            {hasRealData && (
              <LabelList
                dataKey='communityMissing'
                position='inside'
                formatter={(communityMissing: boolean) =>
                  communityMissing ? 'Aucune donnée publiée' : ''
                }
                fill={theme.secondaryColor}
                strokeWidth={0}
                fontSize='16'
                fontWeight='600'
                fontFamily='var(--font-kanit), system-ui, sans-serif'
                offset={20}
              />
            )}
          </Bar>
          <Bar
            dataKey='regional'
            fill={theme.secondaryColor}
            name={data.length > 0 ? data[0].regionalLabel : 'Moyenne régionale'}
            label={(props) => {
              const entry = transformedData[props.index];
              // Only show value for non-missing regional data
              if (!entry?.regionalMissing) {
                return (
                  <text
                    x={props.x + props.width / 2}
                    y={props.y - 8}
                    fill={theme.secondaryColor}
                    textAnchor='middle'
                    fontSize='24'
                    fontWeight='700'
                    fontFamily='var(--font-kanit), system-ui, sans-serif'
                  >
                    {formatValue(entry.regional)}
                  </text>
                );
              }
              return <g />;
            }}
            shape={(props: unknown) => StripedBar(props, theme)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
