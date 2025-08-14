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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ComparisonSkeleton } from './ComparisonSkeleton';
import DesktopComparisonChart from './DesktopComparisonChart';
import MobileComparisonChartV2 from './MobileComparisonChart-v2';
import { TabHeader } from './TabHeader';

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

type ScopeDropdownProps = {
  selectedScope: string;
  onScopeChange: (scope: string) => void;
  disabled?: boolean;
};

const ScopeDropdown = ({ selectedScope, onScopeChange, disabled }: ScopeDropdownProps) => (
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
      <DropdownMenuItem onClick={() => onScopeChange('Régional')}>
        Régional
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onScopeChange('Départemental')}>
        Départemental
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onScopeChange('National')}>
        National
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);


export default function Comparison({ siren }: ComparisonProps) {
  const [data, setData] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false); // Separate loading for data updates
  const [selectedScope, setSelectedScope] = useState('Régional');
  const [displayScope, setDisplayScope] = useState('Régional'); // For title display
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial data fetch - only on mount
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
  }, [siren, selectedScope]);

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

  // Dynamic title that updates when displayScope changes
  const title = `Comparaison avec la moyenne ${displayScope.toLowerCase()}`;

  if (loading) {
    return <ComparisonSkeleton isMobile={isMobile} />;
  }

  // Render content based on state
  const renderContent = () => {
    // No data state
    if (!error && data.length === 0) {
      return (
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
      );
    }

    // Error state
    if (error) {
      return (
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
      );
    }

    // Success state with data
    return (
      <>
        {isMobile ? (
          <MobileComparisonChartV2 data={data} dataLoading={dataLoading} />
        ) : (
          <DesktopComparisonChart data={data} dataLoading={dataLoading} />
        )}

        {/* Legend */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#303F8D] rounded"></div>
              <span className="text-sm">{data.length > 0 ? data[0].regionalLabel : "Moyenne régionale"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{data.length > 0 ? data[0].communityLabel : "Budget de collectivité"}</span>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <TabHeader
        title={title}
        actions={
          <>
            <ScopeDropdown
              selectedScope={selectedScope}
              onScopeChange={handleScopeChange}
              disabled={dataLoading}
            />
            {downloadButton}
          </>
        }
      />
      {renderContent()}
    </>
  );
}