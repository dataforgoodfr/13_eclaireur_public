'use client';

import { ActionButton } from '#components/ui/action-button';
import { Button } from '#components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu';
import { ChevronDown, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type ComparisonProps = {
  siren: string;
};

type ComparisonData = {
  year: string;
  community: number;
  communityLabel: string;
  regional: number;
  regionalLabel: string;
};

export default function Comparison({ siren }: ComparisonProps) {
  const [data, setData] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScope, setSelectedScope] = useState('Régional');

  useEffect(() => {
    const fetchComparisonData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/communities/${siren}/marches_publics/comparison?scope=${selectedScope.toLowerCase()}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching comparison data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [siren, selectedScope]);

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('fr-FR').format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatValue(entry.value)} €
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderCustomBarLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#303F8D"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fontFamily="var(--font-kanit), system-ui, sans-serif"
      >
        {value}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-gray-500">Chargement des données de comparaison...</div>
      </div>
    );
  }

  const handleDownload = () => {
    // Handle download logic
    console.log('Downloading comparison data...');
  };

  // Custom shape for striped bars (rayé)
  const StripedBar = (props: any) => {
    const { fill, x, y, width, height } = props;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-medium mb-2">Comparaison avec la moyenne régionale</h3>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 h-12 px-4 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none bg-white border-gray-300 hover:bg-gray-50"
              >
                {selectedScope}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedScope('Régional')}>
                Régional
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedScope('Départemental')}>
                Départemental
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedScope('National')}>
                National
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ActionButton
            onClick={handleDownload}
            icon={<Download className="h-4 w-4" />}
            variant="default"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={data}
            margin={{ top: 30, right: 30, left: 40, bottom: 60 }}
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
              tickFormatter={(value) => `${value / 1000} k€`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />

            <Bar
              dataKey="community"
              fill="#303F8D"
              name="Moyenne des budgets des collectivités régionales"
              label={renderCustomBarLabel}
              radius={[12, 0, 0, 0]}
            />
            <Bar
              dataKey="regional"
              fill="#303F8D"
              name="Budget de collectivité"
              label={renderCustomBarLabel}
              shape={StripedBar}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-primary">
              <strong>Note:</strong> Cette comparaison présente les montants moyens des marchés publics
              de votre collectivité par rapport à la moyenne régionale des collectivités de taille similaire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}