import { useState } from 'react';

import { PaginationProps } from '@/components/Pagination';

const DEFAULT_PAGE = 1;

/**
 * Hook that handles pagination logic
 * @param initialPage
 * @returns
 */
export function usePagination(initialPage = DEFAULT_PAGE): Omit<PaginationProps, 'totalPage'> {
  const [page, setPage] = useState(initialPage);

  return {
    activePage: page,
    onPageChange: setPage,
  };
}
