'use client';

import { parseAsString, useQueryState } from 'nuqs';

export const TAB_VALUES = {
  MARCHES_PUBLICS: {
    TRENDS: 'tendances',
    DISTRIBUTION: 'distribution',
    COMPARISON: 'comparaison',
    DETAILS: 'contrats',
  },
  SUBVENTIONS: {
    TRENDS: 'tendances',
    DISTRIBUTION: 'distribution',
    COMPARISON: 'comparaison',
    DETAILS: 'contrats',
  }
} as const;

export function useMarchesPublicsTab(defaultValue: string = TAB_VALUES.MARCHES_PUBLICS.TRENDS) {
  return useQueryState('mp', parseAsString.withDefault(defaultValue));
}

export function useSubventionsTab(defaultValue: string = TAB_VALUES.SUBVENTIONS.TRENDS) {
  return useQueryState('sub', parseAsString.withDefault(defaultValue));
}