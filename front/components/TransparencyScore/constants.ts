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
    "Publication complète et claire. Pour une grande collectivité, cela traduit une transparence aboutie et structurée. Pour une petite commune, c'est un effort remarquable compte tenu de moyens limités.",
  [TransparencyScore.B]:
    'La plupart des données sont accessibles, avec quelques manques ou erreurs. Pour une grande collectivité, il reste une marge de progression. Pour une petite collectivité, cela montre déjà une démarche volontariste.',
  [TransparencyScore.C]:
    'Des données existent, mais elles sont partielles, irrégulières ou difficiles à exploiter. Niveau acceptable pour une petite commune débutant dans la publication. Plus problématique pour une collectivité importante qui devrait être plus respectueuse de ses obligations.',
  [TransparencyScore.D]:
    'Très peu de données sont disponibles. Entendable temporairement pour une petite collectivité manquant de ressources, mais peu tolérable pour une grande collectivité ayant des obligations légales de publication.',
  [TransparencyScore.E]:
    'Absence quasi totale voir totale de données publiées. Peut refléter un manque de moyens pour une petite commune, mais constitue un défaut grave de transparence pour une grande collectivité.',
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
  [TransparencyScore.A]: '100% (+/- 5%)',
  [TransparencyScore.B]: 'De 50% à 95% ou > 105%',
  [TransparencyScore.C]: 'De 25% à 50%',
  [TransparencyScore.D]: 'De 0% à 25%',
  [TransparencyScore.E]: '0% - Aucune donnée',
  [TransparencyScore.UNKNOWN]: 'Non disponible',
};
