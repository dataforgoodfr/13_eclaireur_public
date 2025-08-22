'use client';

import type { HTMLAttributes, PropsWithChildren } from 'react';

import { usePaginationState } from '#hooks/usePaginationState';
import { cn } from '#utils/utils';

import { Pagination, type PaginationProps } from './Pagination';

export type WithPaginationProps = PropsWithChildren<
  Omit<PaginationProps, 'activePage' | 'onPageChange'> & {
    /**
     * Nom du paramètre d'URL pour la pagination (défaut: 'page')
     */
    urlParam?: string;
    /**
     * Page par défaut si aucun paramètre dans l'URL (défaut: 1)
     */
    defaultPage?: number;
    /**
     * Callback optionnel appelé lors du changement de page
     */
    onPageChange?: (page: number) => void;
    /**
     * Mode de pagination : 'url' pour sync URL avec nuqs, 'controlled' pour mode controlé externe
     */
    mode?: 'url' | 'controlled';
    /**
     * Page active (mode controlled uniquement)
     */
    activePage?: number;
  }
> &
  Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * Pagination wrapper for tables with automatic URL synchronization via nuqs
 *
 * Modes disponibles :
 * - 'url' (défaut) : Synchronisation automatique avec l'URL via nuqs
 * - 'controlled' : Mode controlé externe (pour compatibilité avec l'existant)
 *
 * @example
 * ```tsx
 * // Mode URL (nouveau comportement par défaut)
 * <WithPagination totalPage={50}>
 *   <MyTable />
 * </WithPagination>
 *
 * // Mode controlé (ancien comportement)
 * <WithPagination
 *   mode="controlled"
 *   totalPage={50}
 *   activePage={currentPage}
 *   onPageChange={setCurrentPage}
 * >
 *   <MyTable />
 * </WithPagination>
 * ```
 */
export function WithPagination({
  children,
  className,
  style,
  mode = 'url',
  urlParam = 'page',
  defaultPage = 1,
  onPageChange,
  activePage,
  ...restProps
}: WithPaginationProps) {
  const urlState = usePaginationState(urlParam, defaultPage);

  // Mode URL : utilise nuqs pour sync URL
  if (mode === 'url') {
    const handlePageChange = (newPage: number) => {
      urlState.setPage(newPage);
      onPageChange?.(newPage);
    };

    return (
      <div
        className={cn('flex flex-col items-center justify-between gap-2', className)}
        style={style}
      >
        {children}
        <Pagination
          {...restProps}
          activePage={urlState.currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    );
  }

  // Mode controlé : comportement original
  return (
    <div
      className={cn('flex flex-col items-center justify-between gap-2', className)}
      style={style}
    >
      {children}
      <Pagination
        {...restProps}
        activePage={activePage || 1}
        onPageChange={onPageChange || (() => {})}
      />
    </div>
  );
}
