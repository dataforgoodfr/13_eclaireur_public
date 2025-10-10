import { AdvancedSearchCommunity } from '#app/models/community';
import { ExtendedColumnSort } from '#types/data-table';
import { Order } from '#utils/fetchers/types';

export type AdvancedSearchOrder = Order<
  'nom' | 'type' | 'population' | 'mp_score' | 'subventions_score' | 'subventions_budget'
>;

export const DEFAULT_ORDER: AdvancedSearchOrder = {
  by: 'nom',
  direction: 'ASC',
};

export const COLUMN_IDS: string[] = [
  'nom',
  'type',
  'population',
  'subventions_budget',
  'mp_score',
  'subventions_score',
];

export function getOrderFromSortingState(
  sortingColumn: ExtendedColumnSort<AdvancedSearchCommunity>,
): AdvancedSearchOrder {
  // Convert to API format
  return {
    by: (sortingColumn?.id || 'nom') as
      | 'nom'
      | 'type'
      | 'population'
      | 'subventions_budget'
      | 'mp_score'
      | 'subventions_score',
    direction: (sortingColumn?.desc ? 'DESC' : 'ASC') as 'ASC' | 'DESC',
  };
}
