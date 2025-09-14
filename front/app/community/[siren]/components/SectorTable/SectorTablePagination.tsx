'use client';

import { Pagination } from '@/components/Pagination/Pagination';
import { cn } from '@/utils/utils';
import type { Table } from '@tanstack/react-table';

interface SectorTablePaginationProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
}

export function SectorTablePagination<TData>({
  table,
  className,
  ...props
}: SectorTablePaginationProps<TData>) {
  // Only show pagination if there's more than one page
  if (table.getPageCount() <= 1) {
    return null;
  }

  return (
    <div className={cn('flex w-full items-center justify-center p-1', className)} {...props}>
      <Pagination
        totalPage={table.getPageCount()}
        activePage={table.getState().pagination.pageIndex + 1}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        maxVisiblePages={5}
      />
    </div>
  );
}
