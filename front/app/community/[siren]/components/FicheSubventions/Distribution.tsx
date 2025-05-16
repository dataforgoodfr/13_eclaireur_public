'use client';

import { useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import YearSelector from '@/app/community/[siren]/components/YearSelector';
import { downloadSubventionsByNafCSV } from '@/utils/fetchers/subventions/download/downloadSubventionsByNaf';

import { YearOption } from '../../types/interface';
import { GraphSwitch } from '../DataViz/GraphSwitch';
import SubventionsSectorTable from './SubventionsSectorTable';
import SubventionsSectorTreemap from './SubventionsSectorTreemap';

type DistributionProps = { siren: string; availableYears: number[] };

export default function Distribution({ siren, availableYears }: DistributionProps) {
    const defaultYear : number | 'All' = availableYears.length > 0 ? Math.max(...availableYears) : 'All';
const [selectedYear, setSelectedYear] = useState<YearOption>('All');
  const [isTableDisplayed, setIsTableDisplayed] = useState(false);

  function handleClickDownloadData() {
    downloadSubventionsByNafCSV(siren, selectedYear === 'All' ? null : selectedYear);
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>Répartition par secteur</h3>
          <GraphSwitch
            isActive={isTableDisplayed}
            onChange={setIsTableDisplayed}
            label1='graphique'
            label2='tableau'
          />
        </div>
        <div className='flex items-center gap-2'>
          <YearSelector defaultValue={defaultYear} onSelect={setSelectedYear} />
          <DownloadSelector onClickDownloadData={handleClickDownloadData} />
        </div>
      </div>
      {isTableDisplayed ? (
        <SubventionsSectorTable siren={siren} year={selectedYear} />
      ) : (
        <SubventionsSectorTreemap siren={siren} year={selectedYear} />
      )}
    </>
  );
}
