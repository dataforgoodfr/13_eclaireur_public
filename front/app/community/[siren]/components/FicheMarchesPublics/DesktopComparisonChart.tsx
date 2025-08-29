'use client';

import { useRouter } from 'next/navigation';

import { ActionButton } from '#components/ui/action-button';
import { formatCompactPrice, formatMonetaryValue, getMonetaryUnit } from '#utils/utils';
import { MessageSquare } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type ComparisonData = {
  year: string;
  community: number;
  communityLabel: string;
  regional: number;
  regionalLabel: string;
};

type DesktopChartProps = {
  data: ComparisonData[];
  dataLoading: boolean;
  siren?: string;
};

// Custom shape for community bars
const CommunityBar = (props: unknown) => {
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
  const strokeColor = payload?.communityMissing ? '#E5C72E' : '#303F8D';
  const radius = 12;

  return (
    <path
      d={`
        M ${x + radius} ${y}
        L ${x + width} ${y}
        L ${x + width} ${y + height}
        L ${x} ${y + height}
        L ${x} ${y + radius}
        Q ${x} ${y} ${x + radius} ${y}
        Z
      `}
      fill={actualFill}
      stroke={strokeColor}
      strokeWidth={1}
    />
  );
};

// Custom shape for striped bars (rayé)
const StripedBar = (props: unknown) => {
  const { fill, x, y, width, height, payload } = props as {
    fill: string;
    x: number;
    y: number;
    width: number;
    height: number;
    payload?: { regionalMissing?: boolean };
  };

  // Use yellow if data is missing
  const actualFill = payload?.regionalMissing ? '#F4D93E' : fill;
  const strokeColor = payload?.regionalMissing ? '#E5C72E' : fill;

  const patternId = `stripes-${x}`;
  const radius = 12;

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
          M ${x + radius} ${y}
          L ${x + width} ${y}
          L ${x + width} ${y + height}
          L ${x} ${y + height}
          L ${x} ${y + radius}
          Q ${x} ${y} ${x + radius} ${y}
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
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className='rounded-lg border border-gray-100 bg-white/95 p-4 shadow-xl backdrop-blur-sm'>
        <p className='mb-3 text-sm font-semibold text-gray-600'>Année {label}</p>
        <div className='space-y-2'>
          {payload.map((entry, index: number) => {
            const isStriped = entry.dataKey === 'regional';
            return (
              <div key={index} className='flex items-center gap-3'>
                {isStriped ? (
                  <svg width='16' height='16' className='flex-shrink-0'>
                    <defs>
                      <pattern
                        id='tooltip-stripes'
                        patternUnits='userSpaceOnUse'
                        width='6'
                        height='6'
                        patternTransform='rotate(45)'
                      >
                        <rect width='2' height='6' fill='#303F8D' />
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
                  <div className='h-4 w-4 flex-shrink-0 rounded bg-primary' />
                )}
                <div className='flex-1'>
                  <p className='text-sm text-gray-700'>{entry.name}</p>
                  <p className='text-base font-bold text-primary'>
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

// Custom bar label renderer factory
const createCustomBarLabel = (formatValue: (value: number) => string) => {
  const CustomBarLabel = (props: {
    x: number;
    y: number;
    width: number;
    height: number;
    value: number;
    index?: number;
    payload?: { communityMissing?: boolean; regionalMissing?: boolean };
  }) => {
    const { x, y, width, height, value, payload } = props;

    // Check if this bar represents missing data
    const isMissing = payload?.communityMissing || payload?.regionalMissing;

    if (isMissing) {
      // Show "Aucune donnée" centered in the bar
      return (
        <text
          x={x + width / 2}
          y={y + height / 2}
          fill='#303F8D'
          textAnchor='middle'
          fontSize='14'
          fontWeight='600'
          fontFamily='var(--font-kanit), system-ui, sans-serif'
          dominantBaseline='middle'
        >
          Aucune donnée
        </text>
      );
    }

    return (
      <text
        x={x + width / 2}
        y={y - 8}
        fill='#303F8D'
        textAnchor='middle'
        fontSize='24'
        fontWeight='700'
        fontFamily='var(--font-kanit), system-ui, sans-serif'
        offset={10}
      >
        {formatValue(value)}
      </text>
    );
  };

  CustomBarLabel.displayName = 'CustomBarLabel';
  return CustomBarLabel;
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

export default function DesktopComparisonChart({ data, dataLoading, siren }: DesktopChartProps) {
  const router = useRouter();

  // Calculate max value for proper Y-axis scaling
  const allValues = data.flatMap((d) => [d.community, d.regional]);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;

  // Determine the appropriate unit based on max value
  const unit = getMonetaryUnit(maxValue);

  // Format function based on the chosen unit
  const formatValue = (value: number) => formatMonetaryValue(value, unit);

  // Add padding to max value to prevent bars from touching the top
  const yAxisMax = Math.round(maxValue * 1.15);
  const avgValue = maxValue / 2; // Average value for "Aucune donnée"

  // Check if any data is missing
  const hasNoData = data.some((item) => item.community === 0 || item.regional === 0);

  // Transform data to replace 0 values with average
  const transformedData = data.map((item) => ({
    ...item,
    community: item.community === 0 ? avgValue : item.community,
    regional: item.regional === 0 ? avgValue : item.regional,
    communityMissing: item.community === 0,
    regionalMissing: item.regional === 0,
  }));

  const handleInterpellerClick = () => {
    if (siren) {
      router.push(`/interpeller/${siren}/step1`);
    }
  };

  return (
    <div className='relative'>
      {dataLoading && <LoadingOverlay />}

      {/* Interpeller button when there's no data */}
      {hasNoData && siren && (
        <div className='absolute right-4 top-4 z-10'>
          <ActionButton
            onClick={handleInterpellerClick}
            icon={<MessageSquare size={20} />}
            variant='default'
          >
            Interpeller
          </ActionButton>
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
          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey='community'
            fill='#303F8D'
            name={data.length > 0 ? data[0].communityLabel : 'Budget de collectivité'}
            label={createCustomBarLabel(formatValue)}
            shape={CommunityBar}
          />
          <Bar
            dataKey='regional'
            fill='#303F8D'
            name={data.length > 0 ? data[0].regionalLabel : 'Moyenne régionale'}
            label={createCustomBarLabel(formatValue)}
            shape={StripedBar}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
