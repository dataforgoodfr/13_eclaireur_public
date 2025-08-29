'use client';

import { useState } from 'react';

import DownloadSelector from '#app/community/[siren]/components/DownloadDropDown';
import YearSelector from '#app/community/[siren]/components/YearSelector';
import { downloadSubventionsByNafCSV } from '#utils/fetchers/subventions/download/downloadSubventionsByNaf';

import { YearOption } from '../../types/interface';
import { GraphSwitch } from '../DataViz/GraphSwitch';
import SubventionsSectorTable from './SubventionsSectorTable';
import SubventionsSectorTreemap from './SubventionsSectorTreemap';

type DistributionProps = { siren: string; availableYears: number[] };

export default function Distribution({ siren, availableYears }: DistributionProps) {
  const defaultYear: YearOption = availableYears.length > 0 ? Math.max(...availableYears) : 'All';
  const [selectedYear, setSelectedYear] = useState<YearOption>('All');
  const [isTableDisplayed, setIsTableDisplayed] = useState(false);

  function handleClickDownloadData() {
    downloadSubventionsByNafCSV(siren, selectedYear === 'All' ? null : selectedYear);
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
          <YearSelector defaultValue={defaultYear} onSelect={setSelectedYear} />
          <DownloadSelector onClickDownloadData={handleClickDownloadData} />
        </div>
      </div>
      <div style={{ display: isTableDisplayed ? 'block' : 'none' }}>
        <SubventionsSectorTable siren={siren} year={selectedYear} />
      </div>
      <div style={{ display: !isTableDisplayed ? 'block' : 'none' }}>
        <SubventionsSectorTreemap siren={siren} year={selectedYear} />
      </div>
    </>
  );
}
