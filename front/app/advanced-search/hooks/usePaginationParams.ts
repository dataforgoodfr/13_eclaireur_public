'use client';

import { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Pagination } from '@/utils/fetchers/types';
import { parseNumber } from '@/utils/utils';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

export function usePaginationParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setPage = useCallback(
    (value: number) => {
      const newParams = new URLSearchParams(searchParams);

      newParams.set('page', value.toString());

      router.push(`${pathname}?${newParams.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const limit = parseNumber(searchParams.get('limit')) ?? DEFAULT_LIMIT;
  const page = parseNumber(searchParams.get('page')) ?? DEFAULT_PAGE;

  const pagination: Pagination = {
    page,
    limit,
  };

  return {
    pagination,
    setPage,
  };
}
