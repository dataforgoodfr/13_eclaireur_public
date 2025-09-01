'use client';

import { useRef, useState } from 'react';

import { downloadSVGChart } from '#utils/downloader/downloadSVGChart';
import { Extension } from '#utils/downloader/types';

import { GraphSwitch } from '../DataViz/GraphSwitch';
import DownloadChartDropDown from '../DownloadChartDropDown';
import { TabHeader } from '../TabHeader';
import { SubventionsChart } from './SubventionsChart';

type EvolutionProps = {
  siren: string;
  communityName: string;
};

export default function Evolution({ siren, communityName }: EvolutionProps) {
  const [isSubventionsCountDisplayed, setIsSubventionsCountDisplayed] = useState(false);
  const subventionsChartRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadClick = async (extension: Extension) => {
    if (subventionsChartRef.current) {
      downloadSVGChart(
        subventionsChartRef.current,
        {
          communityName,
          chartTitle: 'Évolution des subventions au cours du temps',
        },
        { fileName: `évolution-${communityName.slice(0, 15)}`, extension },
      );
    }
  };

  return (
    <div className='w-full'>
      <TabHeader
        title='Évolution des subventions au cours du temps'
        titleSwitch={
          <GraphSwitch
            isActive={isSubventionsCountDisplayed}
            onChange={setIsSubventionsCountDisplayed}
            label1='Montants annuels'
            label2='Nombre de subventions'
          />
        }
        actions={<DownloadChartDropDown onClickDownload={handleDownloadClick} />}
      />

      {/* Chart Section */}
      <div className='p-4 md:p-6'>
        <SubventionsChart
          ref={subventionsChartRef}
          siren={siren}
          displayMode={isSubventionsCountDisplayed ? 'counts' : 'amounts'}
        />
      </div>
    </div>
  );
}
