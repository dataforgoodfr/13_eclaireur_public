// Score grade colors — aligned with the map and community page palette
// (tailwind `score` tokens from tailwind.config.ts)
export const SCORE_COLORS: Record<string, string> = {
  A: '#79B381',
  B: '#B2D675',
  C: '#FFDE8B',
  D: '#FFA466',
  E: '#FF8573',
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

// Chart theme — matches the community evolution charts (evolutionThemes.ts)
export const MP_THEME = {
  fill: '#CAD2FC',
  fillTranslucent: '#CAD2FC40',
  stroke: '#303F8D',
} as const;

export const SUB_THEME = {
  fill: '#E8F787',
  fillTranslucent: '#E8F78740',
  stroke: '#303F8D',
} as const;
