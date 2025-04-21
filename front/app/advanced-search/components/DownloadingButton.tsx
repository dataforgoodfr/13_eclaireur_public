'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { createAdvancedSearchDownloadingURL } from '@/utils/fetchers/advanced-search/download/downloadAdvancedSearch-client';

import { useFiltersParams } from '../hooks/useFiltersParams';
import { useOrderParams } from '../hooks/useOrderParams';
import { usePaginationParams } from '../hooks/usePaginationParams';

export default function DownloadingButton() {
  const { filters } = useFiltersParams();
  const { pagination } = usePaginationParams();
  const { order } = useOrderParams();
  const downloadingURL = createAdvancedSearchDownloadingURL(filters, pagination, order);

  return (
    <Link href={downloadingURL} download={true} target='_blank'>
      <Button variant='secondary'>Télécharger</Button>
    </Link>
  );
}
