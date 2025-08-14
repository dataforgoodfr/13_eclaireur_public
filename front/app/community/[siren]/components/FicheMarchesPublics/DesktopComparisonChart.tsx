'use client';

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
};

// Custom shape for striped bars (rayé)
const StripedBar = (props: unknown) => {
  const { fill, x, y, width, height } = props as {
    fill: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
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
          <rect width="2" height="6" fill={fill} />
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
        stroke={fill}
        strokeWidth={1}
      />
    </g>
  );
};

// Format value for tooltip
const formatValue = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

// Format value for bar labels
const formatDesktopValue = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(0)} Md €`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)} M €`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)} k €`;
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
        <p className="font-semibold">{label}</p>
        {payload.map((entry, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {formatValue(entry.value)} €
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom bar label renderer
const renderCustomBarLabel = (props: {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
}) => {
  const { x, y, width, value } = props;

  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill="#303F8D"
      textAnchor="middle"
      fontSize="12"
      fontWeight="700"
      fontFamily="var(--font-kanit), system-ui, sans-serif"
      dominantBaseline="middle"
    >
      {formatDesktopValue(value)}
    </text>
  );
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

export default function DesktopComparisonChart({ data, dataLoading }: DesktopChartProps) {
  // Calculate max value for proper Y-axis scaling
  const allValues = data.flatMap(d => [d.community, d.regional]);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
  
  // Add padding to max value to prevent bars from touching the top
  const yAxisMax = Math.round(maxValue * 1.15);

  return (
    <div className="bg-white rounded-lg relative">
      {dataLoading && <LoadingOverlay />}
      <ResponsiveContainer width="100%" height={550}>
        <BarChart
          data={data}
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
            tickFormatter={(value) => {
              const millions = value / 1000000;
              const roundedToTens = Math.round(millions / 10) * 10 * 1000000;
              return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                notation: 'compact',
                compactDisplay: 'short'
              }).format(roundedToTens);
            }}
            domain={[0, yAxisMax]}
          />
          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="community"
            fill="#303F8D"
            name={data.length > 0 ? data[0].communityLabel : "Budget de collectivité"}
            label={renderCustomBarLabel}
            radius={[12, 0, 0, 0]}
          />
          <Bar
            dataKey="regional"
            fill="#303F8D"
            name={data.length > 0 ? data[0].regionalLabel : "Moyenne régionale"}
            label={renderCustomBarLabel}
            shape={StripedBar}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}