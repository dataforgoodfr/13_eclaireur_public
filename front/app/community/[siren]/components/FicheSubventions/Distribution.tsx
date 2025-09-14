'use client';

import { useRef, useState } from 'react';

import DownloadSelector from '#app/community/[siren]/components/DownloadDropDown';
import YearSelector from '#app/community/[siren]/components/YearSelector';
import { downloadSVGChart } from '#utils/downloader/downloadSVGChart';
import { downloadSubventionsByNafCSV } from '#utils/fetchers/subventions/download/downloadSubventionsByNaf';

import type { YearOption } from '../../types/interface';
import { GraphSwitch } from '../DataViz/GraphSwitch';
import SubventionsSectorTable from './SubventionsSectorTable';
import SubventionsSectorTreemap from './SubventionsSectorTreemap';

type DistributionProps = { siren: string; availableYears: number[]; communityName: string };

export default function Distribution({ siren, availableYears, communityName }: DistributionProps) {
  const subventionsSectorTreemapRef = useRef<HTMLDivElement | null>(null);

  const defaultYear: YearOption = availableYears.length > 0 ? Math.max(...availableYears) : 'All';
  const [selectedYear, setSelectedYear] = useState<YearOption>(defaultYear);
  const [isTableDisplayed, setIsTableDisplayed] = useState(false);

  function handleClickDownloadData() {
    downloadSubventionsByNafCSV(siren, selectedYear === 'All' ? null : selectedYear);
  }

  function handleDownloadChart() {
    if (selectedYear !== 'All' && subventionsSectorTreemapRef.current) {
      downloadSVGChart(
        subventionsSectorTreemapRef.current,
        {
          communityName,
          chartTitle: `Répartition par secteur - ${selectedYear}`,
        },
        {
          fileName: `répartition-${communityName.slice(0, 15)}-${selectedYear}`,
          extension: 'png',
        },
      );
    }
  }

  return (
    <>
      <div className='mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
        <div className='flex flex-col items-center gap-2'>
          <h3 className='py-2 text-xl'>Répartition par secteur</h3>
          <GraphSwitch
            isActive={isTableDisplayed}
            onChange={setIsTableDisplayed}
            label1='Graphique'
            label2='Tableau'
          />
        </div>
        <div className='flex items-center gap-2'>
          <YearSelector defaultValue={selectedYear} onSelect={setSelectedYear} />
          <DownloadSelector
            onClickDownloadData={handleClickDownloadData}
            onClickDownloadChart={handleDownloadChart}
            disabled={selectedYear === 'All'}
          />
        </div>
      </div>
      <div style={{ display: isTableDisplayed ? 'block' : 'none' }}>
        <SubventionsSectorTable siren={siren} year={selectedYear} />
      </div>
      <div style={{ display: !isTableDisplayed ? 'block' : 'none' }}>
        <SubventionsSectorTreemap
          ref={subventionsSectorTreemapRef}
          siren={siren}
          year={selectedYear}
        />
      </div>
    </>
  );
}
