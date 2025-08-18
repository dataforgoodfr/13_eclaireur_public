'use client';

import { useQueryState, parseAsString } from 'nuqs';

export const TAB_VALUES = {
  MARCHES_PUBLICS: {
    TRENDS: 'trends',
    DISTRIBUTION: 'distribution', 
    COMPARISON: 'comparison',
    DETAILS: 'details',
  },
  SUBVENTIONS: {
    TRENDS: 'trends',
    DISTRIBUTION: 'distribution',
    COMPARISON: 'compare', 
    DETAILS: 'details',
  }
} as const;

export function useMarchesPublicsTab(defaultValue: string = TAB_VALUES.MARCHES_PUBLICS.TRENDS) {
  return useQueryState('mp', parseAsString.withDefault(defaultValue));
}

export function useSubventionsTab(defaultValue: string = TAB_VALUES.SUBVENTIONS.TRENDS) {
  return useQueryState('sub', parseAsString.withDefault(defaultValue));
}