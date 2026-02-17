import { AdvancedSearchCommunity } from '#app/models/community';
import { ExtendedColumnSort } from '#types/data-table';
import { Order } from '#utils/fetchers/types';

export type AdvancedSearchOrder = Order<
  'nom' | 'type' | 'population' | 'mp_score' | 'subventions_score' | 'budget_total'
>;

export const DEFAULT_ORDER: AdvancedSearchOrder = {
  by: 'nom',
  direction: 'ASC',
};

export const COLUMN_IDS: string[] = [
  'nom',
  'type',
  'population',
  'budget_total',
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
      | 'budget_total'
      | 'mp_score'
      | 'subventions_score',
    direction: (sortingColumn?.desc ? 'DESC' : 'ASC') as 'ASC' | 'DESC',
  };
}

export enum ExportType {
  Csv = 'csv',
  Excel = 'xlsx',
}
