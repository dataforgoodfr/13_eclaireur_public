export type EvolutionTheme = {
  barColor: string;
  borderColor: string;
  legendLabels: {
    amounts: string;
    counts: string;
  };
};

/**
 * Theme for Marchés Publics evolution charts
 */
export const MARCHES_PUBLICS_EVOLUTION_THEME: EvolutionTheme = {
  barColor: '#CAD2FC', // score-transparence mp (brand-2)
  borderColor: '#303F8D',
  legendLabels: {
    amounts: 'Montant des marchés publics publiés',
    counts: 'Nombre de marchés publics publiés',
  },
};

/**
 * Theme for Subventions evolution charts
 */
export const SUBVENTIONS_EVOLUTION_THEME: EvolutionTheme = {
  barColor: '#E8F787', // score-transparence subvention (brand-2)
  borderColor: '#303F8D',
  legendLabels: {
    amounts: 'Montant des subventions publiées',
    counts: 'Nombre de subventions publiées',
  },
};

/**
 * Get the appropriate evolution theme based on data type
 */
export const getEvolutionTheme = (type: 'marches-publics' | 'subventions'): EvolutionTheme => {
  switch (type) {
    case 'marches-publics':
      return MARCHES_PUBLICS_EVOLUTION_THEME;
    case 'subventions':
      return SUBVENTIONS_EVOLUTION_THEME;
    default:
      return MARCHES_PUBLICS_EVOLUTION_THEME; // Default fallback
  }
};
