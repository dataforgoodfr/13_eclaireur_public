'use client';

import { Pagination } from '#utils/fetchers/types';
import { parseAsInteger, useQueryStates } from 'nuqs';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

const paginationParser = {
  page: parseAsInteger.withDefault(DEFAULT_PAGE),
  limit: parseAsInteger.withDefault(DEFAULT_LIMIT),
};

export function usePaginationParams() {
  const [params, setParams] = useQueryStates(paginationParser);

  const setPage = (value: number) => {
    setParams({ page: value });
  };

  const pagination: Pagination = {
    page: params.page,
    limit: params.limit,
  };

  return {
    pagination,
    setPage,
  };
}
