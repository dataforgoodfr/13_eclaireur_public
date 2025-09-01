'use client';

import { useRef, useState } from 'react';

import { downloadSVGChart } from '#utils/downloader/downloadSVGChart';
import { Extension } from '#utils/downloader/types';

import { GraphSwitch } from '../DataViz/GraphSwitch';
import DownloadChartDropDown from '../DownloadChartDropDown';
import { TabHeader } from '../TabHeader';
import { MarchesPublicsChart } from './MarchesPublicsChart';

type EvolutionProps = {
  siren: string;
  communityName: string;
};

export default function Evolution({ siren, communityName }: EvolutionProps) {
  const [isMarchesPublicsCountDisplayed, setIsMarchesPublicsCountDisplayed] = useState(false);
  const marchesPublicsChartRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadClick = async (extension: Extension) => {
    if (marchesPublicsChartRef.current) {
      downloadSVGChart(
        marchesPublicsChartRef.current,
        {
          communityName,
          chartTitle: 'Évolution des marchés publics au cours du temps',
        },
        { fileName: `évolution-${communityName.slice(0, 15)}`, extension },
      );
    }
  };

  return (
    <div className='w-full'>
      <TabHeader
        title='Évolution des marchés publics au cours du temps'
        titleSwitch={
          <GraphSwitch
            isActive={isMarchesPublicsCountDisplayed}
            onChange={setIsMarchesPublicsCountDisplayed}
            label1='Montants annuels'
            label2='Nombre de contrats'
          />
        }
        actions={<DownloadChartDropDown onClickDownload={handleDownloadClick} />}
      />

      {/* Chart Section */}
      <div className='p-4 md:p-6'>
        <MarchesPublicsChart
          ref={marchesPublicsChartRef}
          siren={siren}
          displayMode={isMarchesPublicsCountDisplayed ? 'counts' : 'amounts'}
        />
      </div>
    </div>
  );
}
