import { CommunityType, ScopeType } from '#utils/types';

/**
 * Détermine le scope de comparaison par défaut selon le type de collectivité
 *
 * Logique :
 * - Région : National (évite la comparaison avec soi-même)
 * - Département : Régional (compare avec autres départements de la région)
 * - Commune/Métropole/EPCI : Départemental (compare avec autres du département)
 * - CTU : National (collectivités spéciales)
 */
export function getDefaultComparisonScope(communityType: CommunityType): ScopeType {
  switch (communityType) {
    case CommunityType.Region:
      return ScopeType.Nation;
    case CommunityType.Departement:
      return ScopeType.Region;
    case CommunityType.Commune:
    case CommunityType.Metropole:
    case CommunityType.CA:
    case CommunityType.CC:
    case CommunityType.EPT:
      return ScopeType.Departement;
    case CommunityType.CTU:
      return ScopeType.Nation;
    default:
      return ScopeType.Departement; // Fallback par défaut
  }
}
