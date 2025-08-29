'use client';

import { parseAsInteger, useQueryState } from 'nuqs';
import { useRef } from 'react';

export const DEFAULT_PAGE = 1;

type PaginationStateOptions = {
  /**
   * Nom du paramètre d'URL (défaut: 'page')
   */
  paramName?: string;
  /**
   * Page par défaut (défaut: 1)
   */
  defaultPage?: number;
  /**
   * Calcul du total de pages basé sur les données
   */
  calculateTotalPage?: (data: any) => number;
};

/**
 * Hook amélioré pour gérer l'état de pagination avec synchronisation URL via nuqs
 * Garde en mémoire le dernier totalPage valide pour éviter la disparition de pagination
 * 
 * @param options - Options de configuration
 * @returns Objet avec la page courante, fonction de changement, et totalPage persistant
 */
export function usePaginationState(
  paramName: string = 'page',
  defaultPage: number = DEFAULT_PAGE
) {
  const [page, setPage] = useQueryState(
    paramName,
    parseAsInteger.withDefault(defaultPage).withOptions({
      shallow: false, // Met à jour l'URL dans l'historique
      clearOnDefault: true, // Supprime le paramètre si valeur par défaut
    })
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1) {
      setPage(newPage);
    }
  };

  return {
    currentPage: page,
    setPage: handlePageChange,
    isLoading: false, // nuqs ne nécessite pas de loading state
  };
}

/**
 * Hook avec calcul persistant du total de pages
 * Évite la disparition de la pagination pendant les loading states
 */
export function usePaginationStateWithTotal<T extends { total_row_count?: number }[]>(
  data: T | undefined,
  isPending: boolean,
  options: {
    paramName?: string;
    defaultPage?: number;
    itemsPerPage?: number;
  } = {}
) {
  const {
    paramName = 'page',
    defaultPage = DEFAULT_PAGE,
    itemsPerPage = 10,
  } = options;

  const { currentPage, setPage } = usePaginationState(paramName, defaultPage);
  
  // Cache du dernier totalPage valide
  const lastValidTotalPage = useRef<number>(1);
  
  // Calculer totalPage depuis les nouvelles données
  let currentTotalPage = 1;
  if (data && data.length > 0 && data[0].total_row_count) {
    currentTotalPage = Math.ceil(data[0].total_row_count / itemsPerPage);
    // Mettre à jour le cache seulement avec de bonnes données
    if (!isPending) {
      lastValidTotalPage.current = currentTotalPage;
    }
  }

  return {
    currentPage,
    setPage,
    // Utilise la dernière valeur valide pendant loading, sinon la valeur actuelle
    totalPage: isPending ? lastValidTotalPage.current : currentTotalPage,
    isStable: !isPending,
  };
}

/**
 * Hook simplifié pour la pagination standard
 */
export function usePageState() {
  return usePaginationState('page', DEFAULT_PAGE);
}