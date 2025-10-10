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
      <div className='flex flex-wrap justify-between'>
        <Filters /> {/* Desktop */}
        <div className='mt-2 flex gap-2 max-md:w-full max-md:justify-end'>
          <ViewOptionsButton table={table} /> {/* Desktop */}
          <DownloadingButton />
          <FilterButton className='md:hidden' /> {/* Mobile */}
        </div>
      </div>
      <CommunitiesTableWithLoader />
    </TableProvider>
  );
}
