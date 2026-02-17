export const SCORE_COLORS: Record<string, string> = {
  A: '#00C882',
  B: '#7FF083',
  C: '#F4D93E',
  D: '#FFB020',
  E: '#FB735F',
};

export const SCORE_ORDER = ['A', 'B', 'C', 'D', 'E'] as const;

export const TYPE_LABELS: Record<string, string> = {
  ALL: 'Toutes',
  COM: 'Communes',
  DEP: 'Départements',
  REG: 'Régions',
  GRP: 'Intercommunalités',
};

export const TYPE_ORDER = ['COM', 'GRP', 'DEP', 'REG'];
