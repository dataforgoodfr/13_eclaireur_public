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
  },
} as const;

export function useMarchesPublicsTab(defaultValue: string = TAB_VALUES.MARCHES_PUBLICS.TRENDS) {
  return useQueryState('mp', parseAsString.withDefault(defaultValue));
}

export function useSubventionsTab(defaultValue: string = TAB_VALUES.SUBVENTIONS.TRENDS) {
  return useQueryState('sub', parseAsString.withDefault(defaultValue));
}

// Scope values for comparison dropdowns
export const SCOPE_VALUES = {
  DEPARTEMENTAL: 'departemental',
  REGIONAL: 'regional',
  NATIONAL: 'national',
} as const;

export type Scope = 'Départemental' | 'Régional' | 'National';

// Map display values to URL values
const SCOPE_URL_MAP: Record<Scope, string> = {
  Départemental: SCOPE_VALUES.DEPARTEMENTAL,
  Régional: SCOPE_VALUES.REGIONAL,
  National: SCOPE_VALUES.NATIONAL,
};

// Map URL values to display values
const URL_SCOPE_MAP: Record<string, Scope> = {
  [SCOPE_VALUES.DEPARTEMENTAL]: 'Départemental',
  [SCOPE_VALUES.REGIONAL]: 'Régional',
  [SCOPE_VALUES.NATIONAL]: 'National',
};

export function useComparisonScope(defaultValue: Scope = 'Départemental') {
  const [urlScope, setUrlScope] = useQueryState(
    'scope',
    parseAsString.withDefault(SCOPE_URL_MAP[defaultValue]),
  );

  const displayScope = URL_SCOPE_MAP[urlScope] || defaultValue;

  const setScope = (scope: Scope) => {
    setUrlScope(SCOPE_URL_MAP[scope]);
  };

  return [displayScope, setScope] as const;
}
