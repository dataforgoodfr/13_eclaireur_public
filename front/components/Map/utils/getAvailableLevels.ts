import type { TerritoryData } from '../types';

/**
 * Calcule les niveaux administratifs disponibles pour un niveau de zoom donné.
 * À chaque zoom, exactement 2 niveaux sont disponibles.
 */
export function getAvailableLevels(
  zoom: number,
  territory: TerritoryData,
): ('regions' | 'departements' | 'communes')[] {
  const { regionsMaxZoom, departementsMaxZoom } = territory;

  if (zoom < regionsMaxZoom) {
    // Bas zoom : Régions (défaut) + Départements (optionnel)
    return ['regions', 'departements'];
  } else if (zoom < departementsMaxZoom) {
    // Moyen zoom : Départements (défaut) + Communes (optionnel)
    return ['departements', 'communes'];
  } else {
    // Haut zoom : Communes (défaut) + Départements (optionnel pour voir moins détaillé)
    return ['departements', 'communes'];
  }
}

/**
 * Retourne le niveau par défaut pour un zoom donné.
 */
export function getDefaultLevelForZoom(
  zoom: number,
  territory: TerritoryData,
): 'regions' | 'departements' | 'communes' {
  const { regionsMaxZoom, departementsMaxZoom } = territory;

  if (zoom < regionsMaxZoom) {
    return 'regions';
  } else if (zoom < departementsMaxZoom) {
    return 'departements';
  } else {
    return 'communes';
  }
}
