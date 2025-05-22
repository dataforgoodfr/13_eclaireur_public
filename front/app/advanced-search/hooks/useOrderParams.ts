'use client';

import { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Order } from '@/utils/fetchers/types';
import { parseDirection } from '@/utils/utils';

export type AdvancedSearchOrder = Order<
  'nom' | 'type' | 'population' | 'mp_score' | 'subventions_score' | 'subventions_budget'
>;

export const DEFAULT_ORDER: AdvancedSearchOrder = {
  by: 'nom',
  direction: 'ASC',
};

export function useOrderParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setOrder = useCallback(
    (order: AdvancedSearchOrder) => {
      const newParams = new URLSearchParams(searchParams);

      newParams.set('by', order.by);
      newParams.set('direction', order.direction);

      router.push(`${pathname}?${newParams.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const by = (searchParams.get('by') as AdvancedSearchOrder['by']) ?? DEFAULT_ORDER.by;
  const direction = parseDirection(searchParams.get('direction')) ?? DEFAULT_ORDER.direction;

  const order: AdvancedSearchOrder = {
    by,
    direction,
  };

  return {
    order,
    setOrder,
  };
}
