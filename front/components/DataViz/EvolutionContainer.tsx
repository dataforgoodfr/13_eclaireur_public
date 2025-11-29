'use client';

import { useEffect, useRef, useState } from 'react';

import { downloadSVGChart } from '#utils/downloader/downloadSVGChart';
import type { Extension } from '#utils/downloader/types';
import { getEvolutionTheme } from '#utils/evolutionThemes';

import { GraphSwitch } from '../../app/community/[siren]/components/DataViz/GraphSwitch';
import DownloadChartDropDown from '../../app/community/[siren]/components/DownloadChartDropDown';
import { TabHeader } from '../../app/community/[siren]/components/TabHeader';
import LoadingOverlay from '../ui/LoadingOverlay';
import EvolutionChart from './EvolutionChart';
import MobileEvolutionChart from './MobileEvolutionChart';

export type DisplayMode = 'amounts' | 'counts';

type EvolutionContainerProps = {
  siren: string;
  communityName: string;
  dataType: 'marches-publics' | 'subventions';
  amountsData: Array<{ year: number; amount?: number }> | null | undefined;
  countsData: Array<{ year: number; count?: number }> | null | undefined;
  isAmountsPending: boolean;
  isCountsPending: boolean;
  isAmountsError: boolean;
  isCountsError: boolean;
};

// Title mapping
const TITLES = {
  'marches-publics': 'Évolution des marchés publics',
  subventions: 'Évolution des subventions',
};

// Switch labels mapping
const SWITCH_LABELS = {
  'marches-publics': {
    label1: 'Montants annuels',
    label2: 'Nombre de contrats',
  },
  subventions: {
    label1: 'Montants annuels',
    label2: 'Nombre de subventions',
  },
};

export default function EvolutionContainer({
  siren,
  communityName,
  dataType,
  amountsData,
  countsData,
  isAmountsPending,
  isCountsPending,
  isAmountsError,
  isCountsError,
}: EvolutionContainerProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('amounts');
  const [isMobile, setIsMobile] = useState(false);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const theme = getEvolutionTheme(dataType);
  const title = TITLES[dataType];
  const switchLabels = SWITCH_LABELS[dataType];

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get current mode data and states
  const isAmountsMode = displayMode === 'amounts';
  const currentData = isAmountsMode ? amountsData : countsData;
  const isPending = isAmountsMode ? isAmountsPending : isCountsPending;
  const isError = isAmountsMode ? isAmountsError : isCountsError;

  const handleDownloadClick = async (extension: Extension) => {
    if (chartRef.current) {
      downloadSVGChart(
        chartRef.current,
        {
          communityName,
          chartTitle: title,
        },
        { fileName: `évolution-${communityName.slice(0, 15)}`, extension },
      );
    }
  };

  return (
    <div className='w-full'>
      <TabHeader
        title={title}
        titleSwitch={
          <GraphSwitch
            isActive={displayMode === 'counts'}
            onChange={(isActive) => setDisplayMode(isActive ? 'counts' : 'amounts')}
            label1={switchLabels.label1}
            label2={switchLabels.label2}
          />
        }
        actions={<DownloadChartDropDown onClickDownload={handleDownloadClick} />}
      />

      {/* Chart Section */}
      <div className='relative md:p-6'>
        {isMobile ? (
          <MobileEvolutionChart
            ref={chartRef}
            siren={siren}
            displayMode={displayMode}
            dataType={dataType}
            data={currentData}
            isPending={isPending}
            isError={isError}
            theme={theme}
          />
        ) : (
          <EvolutionChart
            ref={chartRef}
            siren={siren}
            displayMode={displayMode}
            dataType={dataType}
            data={currentData}
            isPending={isPending}
            isError={isError}
            theme={theme}
          />
        )}

        {/* Loading overlay when data is being fetched */}
        <LoadingOverlay
          isVisible={isPending}
          color={theme.borderColor}
          message='Rechargement des données...'
          opacity='light'
        />
      </div>
    </div>
  );
}
