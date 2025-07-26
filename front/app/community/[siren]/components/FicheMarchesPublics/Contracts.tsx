'use client';

import { useState } from 'react';

import DownloadButton from '#app/community/[siren]/components/DownloadDataButton';
import YearSelector from '#app/community/[siren]/components/YearSelector';
import { usePagination } from '#utils/hooks/usePagination';

import { YearOption } from '../../types/interface';
import MarchesPublicsTable from './MarchesPublicsTable';

type ContractsProps = {
  siren: string;
  availableYears: number[];
};

export default function Contracts({ siren, availableYears }: ContractsProps) {
  const defaultYear: YearOption = availableYears.length > 0 ? Math.max(...availableYears) : 'All';
  const [selectedYear, setSelectedYear] = useState<YearOption>(defaultYear);
  const paginationProps = usePagination();

  function handleSelectedYear(option: YearOption) {
    setSelectedYear(option);
    paginationProps.onPageChange(1);
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>Classement par tailles de contrats</h3>
        </div>
        <div className='flex items-center gap-2'>
          <YearSelector defaultValue={defaultYear} onSelect={handleSelectedYear} />
          <DownloadButton />
        </div>
      </div>
      <MarchesPublicsTable siren={siren} year={selectedYear} paginationProps={paginationProps} />
    </>
  );
}
