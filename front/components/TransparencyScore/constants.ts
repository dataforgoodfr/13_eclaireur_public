export enum TransparencyScore {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  UNKNOWN = 'UNKNOWN',
}

export const SCORE_TO_ADJECTIF = {
  [TransparencyScore.A]: 'Exemplaire',
  [TransparencyScore.B]: 'Transparent',
  [TransparencyScore.C]: 'Moyen',
  [TransparencyScore.D]: 'Insuffisant',
  [TransparencyScore.E]: 'Très insuffisant',
  [TransparencyScore.UNKNOWN]: 'Non disponible',
};

export const SCORE_DESCRIPTION = {
  [TransparencyScore.A]:
    'La structure est très transparente et expose de manière exhaustive ses données.',
  [TransparencyScore.B]: 'La structure est transparente et expose la plupart de ses données.',
  [TransparencyScore.C]:
    'La structure a une transparence moyenne et expose certaines de ses données.',
  [TransparencyScore.D]: 'La structure manque de transparence et expose peu de ses données.',
  [TransparencyScore.E]: 'La structure est opaque et ne rend pas ses données publiques.',
  [TransparencyScore.UNKNOWN]: 'Non disponible',
};

export const SCORE_TRANSPARENCY_COLOR: Record<TransparencyScore, string> = {
  [TransparencyScore.A]: 'bg-score-A',
  [TransparencyScore.B]: 'bg-score-B',
  [TransparencyScore.C]: 'bg-score-C',
  [TransparencyScore.D]: 'bg-score-D',
  [TransparencyScore.E]: 'bg-score-E',
  [TransparencyScore.UNKNOWN]: 'bg-muted-light',
};
export const SCORE_INDICE_COLOR: Record<TransparencyScore, string> = {
  [TransparencyScore.A]: 'bg-scoreIndice-A',
  [TransparencyScore.B]: 'bg-scoreIndice-B',
  [TransparencyScore.C]: 'bg-scoreIndice-C',
  [TransparencyScore.D]: 'bg-scoreIndice-D',
  [TransparencyScore.E]: 'bg-scoreIndice-E',
  [TransparencyScore.UNKNOWN]: 'bg-muted-light',
};
export const SCORE_NON_DISPONIBLE = 'Non disponible';

export const SCORE_TO_RANGE = {
  [TransparencyScore.A]: '100% (+/- 5%) ',
  [TransparencyScore.B]: 'De 75% à 95%',
  [TransparencyScore.C]: 'De 50% à 75%',
  [TransparencyScore.D]: 'De 25% à 50% ',
  [TransparencyScore.E]: 'Moins de 40% ou données inexploitables',
  [TransparencyScore.UNKNOWN]: 'Non disponible',
};
