export enum TransparencyScore {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
}

export const SCORE_TO_ADJECTIF = {
  [TransparencyScore.A]: 'Optimal',
  [TransparencyScore.B]: 'Transparent',
  [TransparencyScore.C]: 'Moyen',
  [TransparencyScore.D]: 'Insuffisant',
  [TransparencyScore.E]: 'Opaque',
};

export const SCORE_NON_DISPONIBLE = 'Non disponible';