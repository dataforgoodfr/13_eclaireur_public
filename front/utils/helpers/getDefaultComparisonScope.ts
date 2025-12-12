import { CommunityType } from '#utils/types';

export type Scope = 'Départemental' | 'Régional' | 'National';

/**
 * Détermine le scope de comparaison par défaut selon le type de collectivité
 *
 * Logique :
 * - Région : National (évite la comparaison avec soi-même)
 * - Département : Régional (compare avec autres départements de la région)
 * - Commune/Métropole/EPCI : Départemental (compare avec autres du département)
 * - CTU : National (collectivités spéciales)
 */
export function getDefaultComparisonScope(communityType: CommunityType): Scope {
  switch (communityType) {
    case CommunityType.Region:
      return 'National';
    case CommunityType.Departement:
      return 'Régional';
    case CommunityType.Commune:
    case CommunityType.GRP:
      return 'Départemental';
    default:
      return 'Départemental'; // Fallback par défaut
  }
}
