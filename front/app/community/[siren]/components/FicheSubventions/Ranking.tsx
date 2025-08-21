'use client';

import { useState } from 'react';

import DownloadButton from '#app/community/[siren]/components/DownloadDataButton';
import YearSelector from '#app/community/[siren]/components/YearSelector';

import { YearOption } from '../../types/interface';
import RankingTable from './RankingTable';

export default function Ranking({
  siren,
  availableYears,
}: {
  siren: string;
  availableYears: number[];
}) {
  const defaultYear: YearOption = availableYears.length > 0 ? Math.max(...availableYears) : 'All';
  const [selectedYear, setSelectedYear] = useState<YearOption>(defaultYear);

  function handleSelectedYear(option: YearOption) {
    setSelectedYear(option);
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>Classement par tailles de subventions</h3>
        </div>
        <div className='flex items-center gap-2'>
          <YearSelector defaultValue={defaultYear} onSelect={handleSelectedYear} />
          <DownloadButton />
        </div>
      </div>
      <RankingTable siren={siren} year={selectedYear} />
    </>
  );
}