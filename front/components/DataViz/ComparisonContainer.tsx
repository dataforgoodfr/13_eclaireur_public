'use client';

import { useEffect, useState } from 'react';

import EmptyState from '#components/EmptyState';
import { ActionButton } from '#components/ui/action-button';
import { Button } from '#components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu';
import { type Scope, useComparisonScope } from '#hooks/useTabState';
import { getDefaultComparisonScope } from '#utils/helpers/getDefaultComparisonScope';
import type { CommunityType } from '#utils/types';
import { getMonetaryUnit } from '#utils/utils';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Download } from 'lucide-react';

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

const ComparisonEmptyState = ({ siren }: { siren: string }) => (
  <EmptyState
    title="Oups, il n'y a pas de données pour comparer !"
    description='Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés, et les inciter à mettre à jour les données sur les subventions publiques.'
    actionText='Interpeller'
    actionHref='/interpeller'
    className='h-[450px] w-full'
    siren={siren}
  />
);

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
}: {
  data: ComparisonData[];
  isLoading: boolean;
  siren: string;
  theme: ComparisonTheme;
  isMobile: boolean;
}) => {
  // For mobile, use the mobile-optimized chart (includes legend)
  if (isMobile) {
    return (
      <MobileComparisonChart data={data} dataLoading={isLoading} siren={siren} theme={theme} />
    );
  }

  // For desktop, use the desktop chart with separate legend
  const allValues = data.flatMap((d) => [d.community, d.regional]);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
  const unit = getMonetaryUnit(maxValue);

  return (
    <>
      <ComparisonChart data={data} dataLoading={isLoading} siren={siren} theme={theme} />

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
          <div className='text-xs font-medium' style={{ color: theme.primaryColor }}>
            Montants exprimés en {unit}
          </div>
        </div>
      </div>
    </>
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

  const handleDownload = () => {
    // TODO: Implement download logic
    console.log('Downloading comparison data...', data);
  };

  const handleScopeChange = (scope: Scope) => {
    if (scope !== selectedScope) {
      setSelectedScope(scope);
    }
  };

  const title = `Comparaison avec la moyenne ${selectedScope.toLowerCase()}`;

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
            <ActionButton
              onClick={handleDownload}
              icon={<Download className='h-4 w-4' />}
              variant='default'
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
          <ComparisonEmptyState siren={siren} />
        ) : (
          <ChartWithLegend
            data={data}
            isLoading={false}
            siren={siren}
            theme={theme}
            isMobile={isMobile}
          />
        )}

        {/* Loading overlay when data is being fetched */}
        <LoadingOverlay
          isVisible={(isLoading || isFetching) && !isError}
          color={theme.primaryColor}
          opacity='medium'
        />
      </div>
    </>
  );
}
