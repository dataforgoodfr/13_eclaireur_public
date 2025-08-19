'use client';

import { useState } from 'react';

import DownloadButton from '#app/community/[siren]/components/DownloadDataButton';
import YearSelector from '#app/community/[siren]/components/YearSelector';
import { usePagination } from '#utils/hooks/usePagination';

import { YearOption } from '../../types/interface';
import { TabHeader } from '../TabHeader';
import SubventionsTable from './SubventionsTable';

type SubventionsProps = {
  siren: string;
  availableYears: number[];
};

export default function Ranking({ siren, availableYears }: SubventionsProps) {
  const defaultYear: YearOption = availableYears.length > 0 ? Math.max(...availableYears) : 'All';
  const [selectedYear, setSelectedYear] = useState<YearOption>(defaultYear);
  const paginationProps = usePagination();

  function handleSelectedYear(option: YearOption) {
    setSelectedYear(option);
    paginationProps.onPageChange(1);
  }

  return (
    <>
      <TabHeader
        title='Classement par tailles de subventions'
        actions={
          <>
            <YearSelector defaultValue={defaultYear} onSelect={handleSelectedYear} />
            <DownloadButton />
          </>
        }
      />
      <SubventionsTable siren={siren} year={selectedYear} paginationProps={paginationProps} />
    </>
  );
}
