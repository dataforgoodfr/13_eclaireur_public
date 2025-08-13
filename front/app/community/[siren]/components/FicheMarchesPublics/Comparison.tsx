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
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import MobileComparisonChartV1 from './MobileComparisonChart-v1';

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
  const [dataLoading, setDataLoading] = useState(false); // Separate loading for data updates
  const [selectedScope, setSelectedScope] = useState('Moyenne régionale');
  const [displayScope, setDisplayScope] = useState('Moyenne régionale'); // For title display
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/communities/${siren}/marches_publics/comparison?scope=${selectedScope.toLowerCase()}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
          setDisplayScope(selectedScope);
        } else {
          setError('Erreur lors du chargement des données');
        }
      } catch (error) {
        console.error('Error fetching comparison data:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [siren]); // Only depend on siren for initial load

  // Separate effect for scope changes
  const fetchComparisonData = useCallback(async (scope: string) => {
    console.log('fetchComparisonData called with scope:', scope);
    setDataLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/communities/${siren}/marches_publics/comparison?scope=${scope.toLowerCase()}`);
      console.log('Response status:', response.status);
      if (response.ok) {
        const result = await response.json();
        console.log('Data received:', result);
        setData(result || []);
        setDisplayScope(scope);
      } else {
        setError('Erreur lors du chargement des données');
      }
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      console.log('Setting dataLoading to false');
      setDataLoading(false);
    }
  }, [siren]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleDownload = useCallback(() => {
    // Handle download logic
    console.log('Downloading comparison data...');
  }, []);

  const handleScopeChange = useCallback((scope: string) => {
    if (scope !== selectedScope) {
      setSelectedScope(scope);
      fetchComparisonData(scope);
    }
  }, [selectedScope, fetchComparisonData]);

  // Memoize only the download button - this should never re-render
  const downloadButton = useMemo(() => (
    <ActionButton
      onClick={handleDownload}
      icon={<Download className="h-4 w-4" />}
      variant="default"
    />
  ), [handleDownload]);

  // Title section that updates only when displayScope changes
  const titleSection = useMemo(() => (
    <div className={isMobile ? 'text-center' : ''}>
      <h3 className="text-xl font-medium mb-2">
        Comparaison avec la moyenne {displayScope.toLowerCase()}e
      </h3>
    </div>
  ), [displayScope, isMobile]);

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

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

  const renderCustomBarLabel = (props: {
    x: number;
    y: number;
    width: number;
    height: number;
    value: number;
  }) => {
    const { x, y, width, value } = props;
    
    // Format the value using ISO standard for French locale
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


  // Skeleton loader component
  const SkeletonLoader = () => {
    return (
      <div className="space-y-2">
      <div className={`flex items-center ${isMobile ? 'flex-col gap-4' : 'justify-between'}`}>
        <div className={isMobile ? 'text-center' : ''}>
          <div className="h-6 bg-gray-200 rounded w-72 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-12 bg-blue-600 rounded w-12 flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      {isMobile ? (
        <div className="bg-white rounded-lg p-4">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="text-center">
                  <div className="h-4 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-6 animate-pulse"></div>
                  <div className="w-full bg-gray-200 rounded-full h-6 animate-pulse"></div>
                </div>
              </div>
            ))}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6">
          <div className="h-[450px] bg-gray-100 rounded flex items-center justify-center">
            <div className="space-y-4 w-full max-w-md">
              <div className="flex justify-between items-end">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex flex-col items-center space-y-2">
                    <div className={`bg-gray-200 rounded animate-pulse w-12`} style={{ height: `${Math.random() * 100 + 50}px` }}></div>
                    <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-gray-200 p-4 rounded">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
      </div>
    );
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  // No data state
  if (!error && data.length === 0) {
    return (
      <div className="space-y-2">
        <div className={`flex items-center ${isMobile ? 'flex-col gap-4' : 'justify-between'}`}>
          {titleSection}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 h-12 px-4 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none bg-white border-gray-300 hover:bg-gray-50"
                  disabled={dataLoading}
                >
  {selectedScope}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleScopeChange('Régional')}>
                  Régional
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleScopeChange('Départemental')}>
                  Départemental
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleScopeChange('National')}>
                  National
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {downloadButton}
          </div>
        </div>
        
        <div className="bg-white rounded-lg" style={{ height: '450px' }}>
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="text-gray-400">
                <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune donnée disponible
                </h3>
                <p className="text-gray-500">
                  Aucune donnée de comparaison n'est disponible pour la période {displayScope.toLowerCase()}e sélectionnée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-2">
        <div className={`flex items-center ${isMobile ? 'flex-col gap-4' : 'justify-between'}`}>
          {titleSection}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 h-12 px-4 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none bg-white border-gray-300 hover:bg-gray-50"
                  disabled={dataLoading}
                >
  {selectedScope}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleScopeChange('Régional')}>
                  Régional
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleScopeChange('Départemental')}>
                  Départemental
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleScopeChange('National')}>
                  National
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {downloadButton}
          </div>
        </div>
        
        <div className="bg-white rounded-lg" style={{ height: '450px' }}>
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="text-red-400">
                <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Erreur de chargement
                </h3>
                <p className="text-gray-500 mb-4">
                  {error}
                </p>
                <Button
                  onClick={() => fetchComparisonData(selectedScope)}
                  disabled={dataLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {dataLoading ? "Chargement..." : "Réessayer"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  // Calculate max value for proper Y-axis scaling
  const allValues = data.flatMap(d => [d.community, d.regional]);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
  
  // Add padding to max value to prevent bars from touching the top  
  const yAxisMax = Math.round(maxValue * 1.15);

  return (
    <div className="space-y-2">
      <div className={`flex items-center ${isMobile ? 'flex-col gap-4' : 'justify-between'}`}>
        {titleSection}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 h-12 px-4 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none bg-white border-gray-300 hover:bg-gray-50"
                disabled={dataLoading}
              >
{selectedScope}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleScopeChange('Régional')}>
                Régional
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleScopeChange('Départemental')}>
                Départemental
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleScopeChange('National')}>
                National
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {downloadButton}
        </div>
      </div>

      {isMobile ? (
        <div className="relative">
          {dataLoading && (
            <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-lg">
              <div className="flex items-center gap-2 text-primary">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                <span>Mise à jour des données...</span>
              </div>
            </div>
          )}
          <MobileComparisonChartV1 data={data} />
        </div>
      ) : (
        <div className="bg-white rounded-lg relative">
          {dataLoading && (
            <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-lg">
              <div className="flex items-center gap-2 text-primary">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                <span>Mise à jour des données...</span>
              </div>
            </div>
          )}
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
      )}

      {/* Legend */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#303F8D] rounded"></div>
            <span className="text-sm">{data.length > 0 ? data[0].regionalLabel : "Moyenne régionale"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded"
              style={{
                background: `repeating-linear-gradient(
                  45deg,
                  #303F8D,
                  #303F8D 2px,
                  white 2px,
                  white 4px
                )`
              }}
            ></div>
            <span className="text-sm">{data.length > 0 ? data[0].communityLabel : "Budget de collectivité"}</span>
          </div>
        </div>
      </div>

    </div>
  );
}