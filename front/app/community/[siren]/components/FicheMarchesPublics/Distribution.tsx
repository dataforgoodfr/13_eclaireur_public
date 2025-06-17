'use client';

import { useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import YearSelector from '@/app/community/[siren]/components/YearSelector';
import { downloadMarchesPublicsByCPV2CSV } from '@/utils/fetchers/marches-publics/download/downloadMarchesPublicsByCPV2';

import { YearOption } from '../../types/interface';
import { GraphSwitch } from '../DataViz/GraphSwitch';
import MarchesPublicsSectorTable from './MarchesPublicsSectorTable';
import MarchesPublicsSectorTreemap from './MarchesPublicsSectorTreeMap';

type DistributionProps = { siren: string; availableYears: number[] };

export default function Distribution({ siren, availableYears }: DistributionProps) {
  const defaultYear: YearOption = availableYears.length > 0 ? Math.max(...availableYears) : 'All';
  const [selectedYear, setSelectedYear] = useState<YearOption>(defaultYear);
  const [isTableDisplayed, setIsTableDisplayed] = useState(false);

  function handleDownloadData() {
    downloadMarchesPublicsByCPV2CSV(siren, selectedYear === 'All' ? null : selectedYear);
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
          <DownloadSelector onClickDownloadData={handleDownloadData} />
        </div>
      </div>
      {isTableDisplayed ? (
        <MarchesPublicsSectorTable siren={siren} year={selectedYear} />
      ) : (
        <MarchesPublicsSectorTreemap siren={siren} year={selectedYear} />
      )}
    </>
  );
}
