'use client';

import { parseAsInteger, useQueryState } from 'nuqs';

import type { YearOption } from '../../../../types/interface';

export function useComparisonYear() {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useQueryState(
    'year',
    parseAsInteger.withDefault(currentYear).withOptions({
      // Synchronise l'état dans l'URL
      shallow: false,
      // Utilise l'historique pour permettre le back/forward
      history: 'push',
      // Débounce pour éviter trop de mises à jour
      throttleMs: 300,
    }),
  );

  const handleYearChange = (option: YearOption) => {
    if (typeof option === 'number') {
      setYear(option);
    }
  };

  return {
    year: year,
    setYear: handleYearChange,
    availableYears: Array.from({ length: 6 }, (_, i) => currentYear - i),
  };
}
