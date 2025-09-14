'use client';

import { useEffect, useRef, useState } from 'react';

import DownloadSelector from '#app/community/[siren]/components/DownloadDropDown';
import EmptyState from '#components/EmptyState';
import { Button } from '#components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu';
import { type Scope, useComparisonScope } from '#hooks/useTabState';
import { downloadSVGChart } from '#utils/downloader/downloadSVGChart';
import { getDefaultComparisonScope } from '#utils/helpers/getDefaultComparisonScope';
import { hasRealComparisonData } from '#utils/placeholderDataGenerators';
import type { CommunityType } from '#utils/types';
import { getMonetaryUnit } from '#utils/utils';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';

import { TabHeader } from '../../app/community/[siren]/components/TabHeader';
import LoadingOverlay from '../ui/LoadingOverlay';
import ComparisonChart, { type ComparisonData, type ComparisonTheme } from './ComparisonChart';
import MobileComparisonChart from './MobileComparisonChart';

type ComparisonContainerProps = {
  siren: string;
  communityType?: CommunityType;
  apiEndpoint: string;
  theme: ComparisonTheme;
  dataType: 'marches-publics' | 'subventions';
};

const SCOPES = ['Départemental', 'Régional', 'National'] as const;

// Generic fetch function
const fetchComparisonData = async (endpoint: string, scope: string): Promise<ComparisonData[]> => {
  const response = await fetch(`${endpoint}?scope=${scope.toLowerCase()}`);

  if (!response.ok) {
    throw new Error('Erreur lors du chargement des données');
  }

  return response.json();
};

// Extracted components for better composition
const ScopeDropdown = ({
  selectedScope,
  onScopeChange,
  disabled,
}: {
  selectedScope: Scope;
  onScopeChange: (scope: Scope) => void;
  disabled?: boolean;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant='outline'
        className='h-12 gap-2 rounded-bl-none rounded-br-lg rounded-tl-lg rounded-tr-none border-gray-300 bg-white px-4 hover:bg-gray-50'
        disabled={disabled}
      >
        {selectedScope}
        <ChevronDown className='h-4 w-4' />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {SCOPES.map((scope) => (
        <DropdownMenuItem key={scope} onClick={() => onScopeChange(scope)}>
          {scope}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const ComparisonEmptyState = ({ siren, dataType }: { siren: string; dataType: string }) => {
  const description =
    dataType === 'marches-publics'
      ? "Il n'y a pas de données de marchés publics disponibles pour cette période. Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés."
      : "Il n'y a pas de données de subventions disponibles pour cette période. Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés.";

  const title =
    dataType === 'marches-publics'
      ? 'Aucune donnée de marchés publics disponible pour la comparaison'
      : 'Aucune donnée de subventions disponible pour la comparaison';

  return (
    <EmptyState
      title={title}
      description={description}
      className='h-[450px] w-full'
      siren={siren}
    />
  );
};

const ErrorState = ({
  error,
  onRetry,
  isRetrying,
}: {
  error: string;
  onRetry: () => void;
  isRetrying: boolean;
}) => (
  <div className='flex h-[450px] items-center justify-center rounded-lg bg-white p-8'>
    <div className='space-y-4 text-center'>
      <div className='text-red-400'>
        <svg
          className='mx-auto h-16 w-16'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-label='Icône erreur'
        >
          <title>Icône erreur</title>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1}
            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      </div>
      <div>
        <h3 className='mb-2 text-lg font-medium text-gray-900'>Erreur de chargement</h3>
        <p className='mb-4 text-gray-500'>{error}</p>
        <Button onClick={onRetry} disabled={isRetrying} className='bg-primary hover:bg-primary/90'>
          {isRetrying ? 'Chargement...' : 'Réessayer'}
        </Button>
      </div>
    </div>
  </div>
);

const ChartWithLegend = ({
  data,
  isLoading,
  siren,
  theme,
  isMobile,
  hasRealData,
  chartRef,
}: {
  data: ComparisonData[];
  isLoading: boolean;
  siren: string;
  theme: ComparisonTheme;
  isMobile: boolean;
  hasRealData: boolean;
  chartRef?: React.RefObject<HTMLDivElement | null>;
}) => {
  // For mobile, use the mobile-optimized chart (includes legend)
  if (isMobile) {
    return (
      <MobileComparisonChart
        data={data}
        dataLoading={isLoading}
        siren={siren}
        theme={theme}
        hasRealData={hasRealData}
      />
    );
  }

  // For desktop, use the desktop chart with separate legend
  const allValues = data.flatMap((d) => [d.community, d.regional]);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
  const unit = getMonetaryUnit(maxValue);

  return (
    <div ref={chartRef}>
      <ComparisonChart
        data={data}
        dataLoading={isLoading}
        siren={siren}
        theme={theme}
        hasRealData={hasRealData}
      />

      <div className='rounded-lg bg-white p-4'>
        <div className='flex flex-col items-center gap-2'>
          <div className='flex flex-wrap justify-center gap-6'>
            <div className='flex items-center gap-2'>
              <div className='h-4 w-4 rounded' style={{ backgroundColor: theme.primaryColor }} />
              <span className='text-sm'>{data[0]?.communityLabel || 'Budget de collectivité'}</span>
            </div>
            <div className='flex items-center gap-2'>
              <svg
                width='16'
                height='16'
                className='rounded'
                aria-label='Pattern rayé pour légende'
              >
                <title>Pattern rayé pour légende</title>
                <defs>
                  <pattern
                    id='stripes-legend'
                    patternUnits='userSpaceOnUse'
                    width='6'
                    height='6'
                    patternTransform='rotate(45)'
                  >
                    <rect width='2' height='6' fill={theme.primaryColor} />
                    <rect x='2' width='4' height='6' fill='white' />
                  </pattern>
                </defs>
                <rect
                  width='16'
                  height='16'
                  fill='url(#stripes-legend)'
                  rx='2'
                  style={{ stroke: theme.strokeColor }}
                  strokeWidth='1'
                />
              </svg>
              <span className='text-sm'>{data[0]?.regionalLabel || 'Moyenne régionale'}</span>
            </div>
          </div>
          <div className='text-xs font-medium text-primary'>Montants exprimés en {unit}</div>
        </div>
      </div>
    </div>
  );
};

export default function ComparisonContainer({
  siren,
  communityType,
  apiEndpoint,
  theme,
  dataType,
}: ComparisonContainerProps) {
  const defaultScope = communityType ? getDefaultComparisonScope(communityType) : 'Départemental';
  const [selectedScope, setSelectedScope] = useComparisonScope(defaultScope);
  const [isMobile, setIsMobile] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Single query for all data fetching with smart caching
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<ComparisonData[], Error>({
    queryKey: [`${dataType}-comparison`, siren, selectedScope],
    queryFn: () => fetchComparisonData(apiEndpoint, selectedScope),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleDownloadData = () => {
    if (!data || data.length === 0) {
      console.warn('No data available for download');
      return;
    }

    // Convert data to CSV format
    const headers = [
      'Année',
      'Collectivité',
      'Montant Collectivité',
      'Moyenne Régionale',
      'Montant Moyenne Régionale',
    ];
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const csvRow = [
        row.year,
        `"${row.communityLabel}"`,
        row.communityMissing ? 'N/A' : row.community,
        `"${row.regionalLabel}"`,
        row.regionalMissing ? 'N/A' : row.regional,
      ];
      csvRows.push(csvRow.join(','));
    }

    const csvContent = csvRows.join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    const fileName = `comparaison_${dataType}_${selectedScope.toLowerCase()}_${siren}_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  const handleDownloadChart = () => {
    if (!chartContainerRef.current || !data || data.length === 0) {
      console.warn('No chart available for download');
      return;
    }

    const communityName = data[0]?.communityLabel || 'Collectivité';
    const chartTitle = `Comparaison avec la moyenne ${selectedScope.toLowerCase()}e - ${dataType === 'marches-publics' ? 'Marchés publics' : 'Subventions'}`;

    downloadSVGChart(
      chartContainerRef.current,
      {
        communityName,
        chartTitle,
      },
      {
        fileName: `comparaison-${dataType}-${selectedScope.toLowerCase()}-${siren}`,
        extension: 'png',
      },
    );
  };

  const handleScopeChange = (scope: Scope) => {
    if (scope !== selectedScope) {
      setSelectedScope(scope);
    }
  };

  const title = `Comparaison avec la moyenne ${selectedScope.toLowerCase()}e`;

  // Check if we have real data (not all missing)
  const dataHasRealValues = hasRealComparisonData(data);

  return (
    <>
      {/* TabHeader is always shown immediately - no skeleton needed */}
      <TabHeader
        title={title}
        actions={
          <>
            <ScopeDropdown
              selectedScope={selectedScope}
              onScopeChange={handleScopeChange}
              disabled={isFetching}
            />
            <DownloadSelector
              onClickDownloadData={handleDownloadData}
              onClickDownloadChart={handleDownloadChart}
              disabled={!data || data.length === 0}
            />
          </>
        }
      />

      {/* Content area - always show chart structure with overlay when loading */}
      <div className='relative'>
        {isError ? (
          <ErrorState
            error={error?.message || 'Erreur lors du chargement des données'}
            onRetry={() => refetch()}
            isRetrying={isFetching}
          />
        ) : data.length === 0 && !isLoading ? (
          <ComparisonEmptyState siren={siren} dataType={dataType} />
        ) : (
          <ChartWithLegend
            data={data}
            isLoading={false}
            siren={siren}
            theme={theme}
            isMobile={isMobile}
            hasRealData={dataHasRealValues}
            chartRef={!isMobile ? chartContainerRef : undefined}
          />
        )}

        {/* Loading overlay when data is being fetched */}
        <LoadingOverlay
          isVisible={(isLoading || isFetching) && !isError}
          color={theme.secondaryColor}
          opacity='medium'
        />
      </div>
    </>
  );
}
