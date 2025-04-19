'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { createAdvancedSearchDownloadingLink } from '@/utils/fetchers/advanced-search/download/downloadAdvancedSearch-client';

import { useFiltersParams } from '../hooks/useFiltersFromSearchParams';
import { usePaginationFromSearchParams } from '../hooks/usePaginationFromSearchParams';

export default function DownloadingButton() {
  const { filters } = useFiltersParams();
  const { pagination } = usePaginationFromSearchParams();
  const downloadingLink = createAdvancedSearchDownloadingLink(filters, pagination).toString();

  return (
    <Link href={downloadingLink} download={true} target='_blank'>
      <Button variant='secondary'>Télécharger</Button>
    </Link>
  );
}
