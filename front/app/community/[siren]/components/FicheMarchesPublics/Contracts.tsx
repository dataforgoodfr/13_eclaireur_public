'use client';

import { useState } from 'react';

import DownloadButton from '#app/community/[siren]/components/DownloadDataButton';
import YearSelector from '#app/community/[siren]/components/YearSelector';
import { downloadMarchesPublicsContratsCSV } from '#utils/fetchers/marches-publics/download/downloadMarchesPublicsContrats';
import { usePagination } from '#utils/hooks/usePagination';

import { YearOption } from '../../types/interface';
import { TabHeader } from '../TabHeader';
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

  function handleDownloadData() {
    if (selectedYear !== 'All') {
      downloadMarchesPublicsContratsCSV(siren, selectedYear);
    }
  }

  return (
    <>
      <TabHeader
        title='Classement par tailles de contrats'
        actions={
          <>
            <YearSelector defaultValue={defaultYear} onSelect={handleSelectedYear} />
            <DownloadButton onClick={handleDownloadData} disabled={selectedYear === 'All'}/>
          </>
        }
      />
      <MarchesPublicsTable siren={siren} year={selectedYear} />
    </>
  );
}
