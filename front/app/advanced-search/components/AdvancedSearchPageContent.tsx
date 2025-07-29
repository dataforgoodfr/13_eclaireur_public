'use client';

import type { Table } from '@tanstack/react-table';
import { useState } from 'react';

import type { AdvancedSearchCommunity } from '@/app/models/community';

import CommunitiesTableWithLoader from './CommunitiesTableWithLoader';
import DownloadingButton from './DownloadingButton';
import { Filters } from './Filters/Filters';
import { TableProvider } from './TableContext';
import { ViewOptionsButton } from './ViewOptionsButton';

export default function AdvancedSearchPageContent() {
  const [table, setTable] = useState<Table<AdvancedSearchCommunity> | null>(null);

  return (
    <TableProvider table={table} setTable={setTable}>
      <div className='relative w-full overflow-auto'>
        <div className='flex items-end justify-between w-max min-w-full'>
          <Filters />
          <div className='flex items-end gap-2'>
            <ViewOptionsButton table={table} />
            <DownloadingButton />
          </div>
        </div>
      </div>
      <CommunitiesTableWithLoader />
    </TableProvider>
  );
}