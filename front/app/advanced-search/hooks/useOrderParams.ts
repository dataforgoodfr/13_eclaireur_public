'use client';

import { useQueryStates, parseAsString, parseAsStringEnum } from 'nuqs';

import { Order } from '#utils/fetchers/types';

export type AdvancedSearchOrder = Order<
  'nom' | 'type' | 'population' | 'mp_score' | 'subventions_score' | 'subventions_budget'
>;

export const DEFAULT_ORDER: AdvancedSearchOrder = {
  by: 'nom',
  direction: 'ASC',
};

const orderParser = {
  by: parseAsStringEnum(['nom', 'type', 'population', 'mp_score', 'subventions_score', 'subventions_budget'] as const)
    .withDefault(DEFAULT_ORDER.by),
  direction: parseAsStringEnum(['ASC', 'DESC'] as const).withDefault(DEFAULT_ORDER.direction),
};

export function useOrderParams() {
  const [params, setParams] = useQueryStates(orderParser);

  const setOrder = (order: AdvancedSearchOrder) => {
    setParams({
      by: order.by,
      direction: order.direction,
    });
  };

  const order: AdvancedSearchOrder = {
    by: params.by,
    direction: params.direction,
  };

  return {
    order,
    setOrder,
  };
}
