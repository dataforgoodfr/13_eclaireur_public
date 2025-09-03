export const GRAPH_START_YEAR = 2018;

export const CRITERIA = [
  'Identifiant marché',
  'Code CPV',
  'Montant',
  'Date de notification',
  'Type de code',
  'Lieu exécution code',
  "Lieu d'exécution nom",
  'Forme de prix',
  'Objet',
  'Nature',
  'Durée en mois',
  'Procédure',
  'Titulaire',
];

export const SCORES = {
  A: {
    title: 'Score A - Exemplaire',
    description:
      'Le score A reflète une exemplarité absolue, avec une publication complète des données pour les marchés de toutes tailles et une conformité totale aux 13 critères définis, garantissant une transparence optimale.',
    picto: '/eclaireur/mascotte_a.svg',
  },
  B: {
    title: 'Score B - Satisfaisant',
    description:
      'Le score B indique une conformité satisfaisante, avec une publication des données pour les marchés de toutes tailles et une conformité aux 13 critères définis, garantissant une transparence suffisante.',
    picto: '/eclaireur/mascotte_b.svg',
  },
  C: {
    title: 'Score C - Moyen',
    description:
      'Le score C indique une conformité moyenne, avec une publication des données pour les marchés de toutes tailles et une conformité aux 13 critères définis, garantissant une transparence suffisante.',
    picto: '/eclaireur/mascotte_c.svg',
  },
  D: {
    title: 'Score D - Insuffisant',
    description:
      'Le score D indique une conformité insuffisante, avec une publication des données pour les marchés de toutes tailles et une conformité aux 13 critères définis, garantissant une transparence insuffisante.',
    picto: '/eclaireur/mascotte_d.svg',
  },
  E: {
    title: 'Score E - Très insuffisant',
    description:
      'Le score E représente une transparence très insuffisante : les données publiées sont quasiment inexistantes, montrant un grave manquement aux exigences de publication et de communication.',
    picto: '/eclaireur/mascotte_e.svg',
  },
};
