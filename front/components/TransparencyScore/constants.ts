export enum TransparencyScore {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  UNKNOWN = 'UNKNOWN',
}

export const SCORE_TO_ADJECTIF = {
  [TransparencyScore.A]: 'Optimal',
  [TransparencyScore.B]: 'Transparent',
  [TransparencyScore.C]: 'Moyen',
  [TransparencyScore.D]: 'Insuffisant',
  [TransparencyScore.E]: 'Opaque',
  [TransparencyScore.UNKNOWN]: 'Non disponible',
};

export const SCORE_DESCRIPTION = {
  [TransparencyScore.A]: 'La structure est très transparente et expose de manière exhaustive ses données.',
  [TransparencyScore.B]: 'La structure est transparente et expose la plupart de ses données.',
  [TransparencyScore.C]: 'La structure a une transparence moyenne et expose certaines de ses données.',
  [TransparencyScore.D]: 'La structure manque de transparence et expose peu de ses données.',
  [TransparencyScore.E]: 'La structure est opaque et ne rend pas ses données publiques.',
};


export const SCORE_NON_DISPONIBLE = 'Non disponible';
