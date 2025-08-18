'use client';

import { ActionButton } from '#components/ui/action-button';
import { formatCompactPrice, formatMonetaryValue, getMonetaryUnit } from '#utils/utils';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
          patternUnits="userSpaceOnUse"
          width="6"
          height="6"
          patternTransform="rotate(45)"
        >
          <rect width="2" height="6" fill={actualFill} />
          <rect x="2" width="4" height="6" fill="white" />
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
const CustomTooltip = ({ active, payload, label }: {
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
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-gray-100">
        <p className="text-sm font-semibold text-gray-600 mb-3">Année {label}</p>
        <div className="space-y-2">
          {payload.map((entry, index: number) => {
            const isStriped = entry.dataKey === 'regional';
            return (
              <div key={index} className="flex items-center gap-3">
                {isStriped ? (
                  <svg width="16" height="16" className="flex-shrink-0">
                    <defs>
                      <pattern 
                        id="tooltip-stripes" 
                        patternUnits="userSpaceOnUse" 
                        width="6" 
                        height="6"
                        patternTransform="rotate(45)"
                      >
                        <rect width="2" height="6" fill="#303F8D" />
                        <rect x="2" width="4" height="6" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="16" height="16" fill="url(#tooltip-stripes)" rx="2" className="stroke-primary" strokeWidth="1" />
                  </svg>
                ) : (
                  <div className="w-4 h-4 rounded bg-primary flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    {entry.name}
                  </p>
                  <p className="text-base font-bold text-primary">
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
          fill="#303F8D"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fontFamily="var(--font-kanit), system-ui, sans-serif"
          dominantBaseline="middle"
        >
          Aucune donnée
        </text>
      );
    }

    return (
      <text
        x={x + width / 2}
        y={y - 8}
        fill="#303F8D"
        textAnchor="middle"
        fontSize="24"
        fontWeight="700"
        fontFamily="var(--font-kanit), system-ui, sans-serif"
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
  <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-lg">
    <div className="flex items-center gap-2 text-primary">
      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
      <span>Mise à jour des données...</span>
    </div>
  </div>
);

export default function DesktopComparisonChart({ data, dataLoading, siren }: DesktopChartProps) {
  const router = useRouter();

  // Calculate max value for proper Y-axis scaling
  const allValues = data.flatMap(d => [d.community, d.regional]);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;

  // Determine the appropriate unit based on max value
  const unit = getMonetaryUnit(maxValue);

  // Format function based on the chosen unit
  const formatValue = (value: number) => formatMonetaryValue(value, unit);

  // Add padding to max value to prevent bars from touching the top
  const yAxisMax = Math.round(maxValue * 1.15);
  const avgValue = maxValue / 2; // Average value for "Aucune donnée"

  // Check if any data is missing
  const hasNoData = data.some(item => item.community === 0 || item.regional === 0);

  // Transform data to replace 0 values with average
  const transformedData = data.map(item => ({
    ...item,
    community: item.community === 0 ? avgValue : item.community,
    regional: item.regional === 0 ? avgValue : item.regional,
    communityMissing: item.community === 0,
    regionalMissing: item.regional === 0
  }));

  const handleInterpellerClick = () => {
    if (siren) {
      router.push(`/interpeller/${siren}/step1`);
    }
  };

  return (
    <div className="relative">
      {dataLoading && <LoadingOverlay />}


      {/* Interpeller button when there's no data */}
      {hasNoData && siren && (
        <div className="absolute top-4 right-4 z-10">
          <ActionButton
            onClick={handleInterpellerClick}
            icon={<MessageSquare size={20} />}
            variant='default'
          >
            Interpeller
          </ActionButton>
        </div>
      )}

      <ResponsiveContainer width="100%" height={550}>
        <BarChart
          data={transformedData}
          margin={{ top: 30, right: 5, left: 10, bottom: 10 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => formatValue(value)}
            domain={[0, yAxisMax]}
          />
          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="community"
            fill="#303F8D"
            name={data.length > 0 ? data[0].communityLabel : "Budget de collectivité"}
            label={createCustomBarLabel(formatValue)}
            shape={CommunityBar}
          />
          <Bar
            dataKey="regional"
            fill="#303F8D"
            name={data.length > 0 ? data[0].regionalLabel : "Moyenne régionale"}
            label={createCustomBarLabel(formatValue)}
            shape={StripedBar}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}