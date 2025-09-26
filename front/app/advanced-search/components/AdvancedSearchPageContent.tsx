'use client';

import { useState } from 'react';

import { FilterButton } from '#app/advanced-search/components/Filters/FilterButton';
import type { AdvancedSearchCommunity } from '@/app/models/community';
import type { Table } from '@tanstack/react-table';

import CommunitiesTableWithLoader from './CommunitiesTableWithLoader';
import DownloadingButton from './DownloadingButton';
import { Filters } from './Filters/Filters';
import { TableProvider } from './TableContext';
import { ViewOptionsButton } from './ViewOptionsButton';

export default function AdvancedFilterPageContent() {
  const [table, setTable] = useState<Table<AdvancedSearchCommunity> | null>(null);
  return (
    <TableProvider table={table} setTable={setTable}>
      {/* Desktop */}
      <div className='flex items-end justify-between max-lg:hidden'>
        <Filters />
        <div className='flex items-end gap-2'>
          <ViewOptionsButton table={table} />
          <DownloadingButton />
        </div>
      </div>
      {/* Mobile */}
      <div className='flex justify-end pr-3 lg:hidden'>
        <FilterButton />
      </div>
      <CommunitiesTableWithLoader />
    </TableProvider>
  );
}
