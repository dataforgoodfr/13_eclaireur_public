'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { createAdvancedSearchDownloadingLink } from '@/utils/fetchers/advanced-search/download/downloadAdvancedSearch-client';

import { useFiltersParams } from '../hooks/useFiltersParams';
import { usePaginationParams } from '../hooks/usePaginationParams';

export default function DownloadingButton() {
  const { filters } = useFiltersParams();
  const { pagination } = usePaginationParams();
  const downloadingLink = createAdvancedSearchDownloadingLink(filters, pagination).toString();

  return (
    <Link href={downloadingLink} download={true} target='_blank'>
      <Button variant='secondary'>Télécharger</Button>
    </Link>
  );
}
