'use client';

import Link from 'next/link';

import { COLUMN_IDS, getOrderFromSortingState } from '#app/api/advanced_search/advancedSearchUtils';
import { AdvancedSearchCommunity } from '#app/models/community';
import { Button } from '#components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu';
import { createAdvancedSearchDownloadingURL } from '#utils/fetchers/advanced-search/download/downloadAdvancedSearch-client';
import { getSortingStateParser } from '#utils/parsers';
import { ArrowDownToLine } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { useFiltersParams } from '../hooks/useFiltersParams';

export default function DownloadingButton() {
  const { filters } = useFiltersParams();
  // Get sorting from DataTable URL params
  const columnIds = new Set(COLUMN_IDS);
  const [sorting] = useQueryState(
    'sort',
    getSortingStateParser<AdvancedSearchCommunity>(columnIds).withDefault([
      { id: 'nom', desc: false },
    ]),
  );

  // Convert to API format
  const order = getOrderFromSortingState(sorting[0]);
  const downloadingURL = createAdvancedSearchDownloadingURL(filters, order);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='default'
          className='rounded-bl-none rounded-br-lg rounded-tl-lg rounded-tr-none bg-primary hover:bg-primary/90 max-md:h-12 max-md:w-14'
        >
          <ArrowDownToLine className='md:hidden' />
          <span className='max-md:sr-only'>Télécharger</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='min-w-[4rem]'>
        <DropdownMenuItem>
          <Link
            className='flex w-full items-center hover:underline'
            href={downloadingURL}
            download={true}
            target='_blank'
          >
            <ArrowDownToLine className='me-2' />
            .csv
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            className='flex w-full items-center hover:underline'
            href={downloadingURL}
            download={true}
            target='_blank'
          >
            <ArrowDownToLine className='me-2' />
            .xlsx
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
