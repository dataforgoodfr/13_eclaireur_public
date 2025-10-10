'use client';

import Link from 'next/link';

import { Button } from '#components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu';
import { createAdvancedSearchDownloadingURL } from '#utils/fetchers/advanced-search/download/downloadAdvancedSearch-client';
import { ArrowDownToLine } from 'lucide-react';

import { useFiltersParams } from '../hooks/useFiltersParams';
import { useOrderParams } from '../hooks/useOrderParams';

export default function DownloadingButton() {
  const { filters } = useFiltersParams();
  const { order } = useOrderParams();
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
