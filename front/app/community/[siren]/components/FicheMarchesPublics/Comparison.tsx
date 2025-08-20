'use client';

import { ActionButton } from '#components/ui/action-button';
import { Button } from '#components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu';
import { useMediaQuery } from '#hooks/useMediaQuery';
import { CommunityType } from '#utils/types';
import { getDefaultComparisonScope, Scope } from '#utils/helpers/getDefaultComparisonScope';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Download } from 'lucide-react';
import { useState } from 'react';
import DesktopComparisonChart from './DesktopComparisonChart';
import MobileComparisonChart from './MobileComparisonChart';
import { TabHeader } from './TabHeader';
import EmptyState from '#components/EmptyState';

type ComparisonProps = {
  siren: string;
  communityType?: CommunityType;
};

type ComparisonData = {
  year: string;
  community: number;
  communityLabel: string;
  regional: number;
  regionalLabel: string;
};

const SCOPES = ['Départemental', 'Régional', 'National'] as const;

// Fetch function outside component to enable reusability
const fetchComparisonData = async (siren: string, scope: string): Promise<ComparisonData[]> => {
  const response = await fetch(
    `/api/communities/${siren}/marches_publics/comparison?scope=${scope.toLowerCase()}`
  );

  if (!response.ok) {
    throw new Error('Erreur lors du chargement des données');
  }

  return response.json();
};

// Extracted components for better composition
const ScopeDropdown = ({
  selectedScope,
  onScopeChange,
  disabled
}: {
  selectedScope: Scope;
  onScopeChange: (scope: Scope) => void;
  disabled?: boolean;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        className="gap-2 h-12 px-4 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none bg-white border-gray-300 hover:bg-gray-50"
        disabled={disabled}
      >
        {selectedScope}
        <ChevronDown className="h-4 w-4" />
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

const ComparisonEmptyState = ({ scope, siren }: { scope: string; siren: string }) => (
  <EmptyState
    title={`Oups, il n'y a pas de données de comparaison pour la période ${scope.toLowerCase()}e !`}
    description="Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés, et les inciter à mettre à jour les données sur les marchés publics."
    actionText="Interpeller"
    actionHref="/interpeller"
    className="h-[450px]"
    siren={siren}
  />
);

const ErrorState = ({ error, onRetry, isRetrying }: {
  error: string;
  onRetry: () => void;
  isRetrying: boolean;
}) => (
  <div className="bg-white rounded-lg h-[450px] flex items-center justify-center p-8">
    <div className="text-center space-y-4">
      <div className="text-red-400">
        <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button
          onClick={onRetry}
          disabled={isRetrying}
          className="bg-primary hover:bg-primary/90"
        >
          {isRetrying ? "Chargement..." : "Réessayer"}
        </Button>
      </div>
    </div>
  </div>
);

const ChartWithLegend = ({
  data,
  isMobile,
  isLoading,
  siren
}: {
  data: ComparisonData[];
  isMobile: boolean;
  isLoading: boolean;
  siren: string;
}) => {
  // Determine the appropriate unit based on max value
  const allValues = data.flatMap(d => [d.community, d.regional]);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
  const unit = maxValue >= 1000000 ? 'M€' : 'k€';

  return (
    <>
      {isMobile ? (
        <MobileComparisonChart data={data} dataLoading={isLoading} siren={siren} />
      ) : (
        <DesktopComparisonChart data={data} dataLoading={isLoading} siren={siren} />
      )}

      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded" />
              <span className="text-sm">
                {data[0]?.regionalLabel || "Moyenne régionale"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" className="rounded">
                <defs>
                  <pattern 
                    id="stripes-legend" 
                    patternUnits="userSpaceOnUse" 
                    width="6" 
                    height="6"
                    patternTransform="rotate(45)"
                  >
                    <rect width="2" height="6" fill="#303F8D" />
                    <rect x="2" width="4" height="6" fill="white" />
                  </pattern>
                </defs>
                <rect width="16" height="16" fill="url(#stripes-legend)" rx="2" className="stroke-primary" strokeWidth="1" />
              </svg>
              <span className="text-sm">
                {data[0]?.communityLabel || "Budget de collectivité"}
              </span>
            </div>
          </div>
          <div className="text-xs text-primary font-medium">
            Montants exprimés en {unit}
          </div>
        </div>
      </div>
    </>
  );
};

// Content-only skeleton for faster TabHeader display
const ContentSkeleton = ({ isMobile }: { isMobile: boolean }) => (
  <>
    {isMobile ? (
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="space-y-1 p-4 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2 py-1 min-w-0">
              <div className="w-10 flex-shrink-0">
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="h-[60px] relative">
                  <div className="absolute top-2">
                    <div className="h-6 w-32 bg-gray-200 rounded-r animate-pulse" />
                    <div className="absolute right-[-50px] top-0">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="absolute top-8">
                    <div className="h-6 w-24 bg-gray-200 rounded-r animate-pulse" />
                    <div className="absolute right-[-40px] top-0">
                      <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="bg-white rounded-lg p-6">
        <div className="h-[400px] flex items-center justify-center">
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-end px-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <div
                    className="w-12 bg-gray-200 rounded animate-pulse"
                    style={{ height: `${Math.random() * 200 + 100}px` }}
                  />
                  <div className="h-3 w-10 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    <div className="bg-white rounded-lg p-4">
      <div className="flex flex-wrap gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  </>
);

export default function Comparison({ siren, communityType }: ComparisonProps) {
  const defaultScope = communityType ? getDefaultComparisonScope(communityType) : 'Départemental';
  const [selectedScope, setSelectedScope] = useState<Scope>(defaultScope);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Single query for all data fetching with smart caching
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery<ComparisonData[], Error>({
    queryKey: ['comparison', siren, selectedScope],
    queryFn: () => fetchComparisonData(siren, selectedScope),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
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
              icon={<Download className="h-4 w-4" />}
              variant="default"
            />
          </>
        }
      />

      {/* Content area with fast skeleton or actual data */}
      {isLoading && !data.length ? (
        <ContentSkeleton isMobile={isMobile} />
      ) : isError ? (
        <ErrorState
          error={error?.message || 'Erreur lors du chargement des données'}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      ) : data.length === 0 ? (
        <ComparisonEmptyState scope={selectedScope} siren={siren} />
      ) : (
        <ChartWithLegend
          data={data}
          isMobile={isMobile}
          isLoading={isFetching}
          siren={siren}
        />
      )}
    </>
  );
}