import type { ComparisonTheme } from '#components/DataViz/ComparisonChart';

/**
 * Theme for Marchés Publics comparison charts
 * Uses primary color (#303F8D - blue)
 */
export const MARCHES_PUBLICS_THEME: ComparisonTheme = {
  primaryColor: '#303F8D',
  secondaryColor: '#303F8D',
  strokeColor: '#303F8D',
};

/**
 * Theme for Subventions comparison charts
 * Uses brand-2 color (#E8F787 - green)
 */
export const SUBVENTIONS_THEME: ComparisonTheme = {
  primaryColor: '#E8F787',
  secondaryColor: '#E8F787',
  strokeColor: '#E8F787',
};

/**
 * Get the appropriate theme based on context
 */
export const getComparisonTheme = (type: 'marches-publics' | 'subventions'): ComparisonTheme => {
  switch (type) {
    case 'marches-publics':
      return MARCHES_PUBLICS_THEME;
    case 'subventions':
      return SUBVENTIONS_THEME;
    default:
      return MARCHES_PUBLICS_THEME; // Default fallback
  }
};
