import { HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '@/utils/utils';

import { Pagination, PaginationProps } from './Pagination';

export type WithPaginationProps = PropsWithChildren<PaginationProps> &
  Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * Pagination wrapper for tables
 */
export function WithPagination({ children, className, style, ...restProps }: WithPaginationProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-between gap-2', className)}
      style={style}
    >
      {children}
      <Pagination {...restProps} />
    </div>
  );
}
