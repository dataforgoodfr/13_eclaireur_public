export enum CommunityType {
  Region = 'REG',
  Departement = 'DEP',
  Commune = 'COM',
  /** Metropole au sens de la ville principale d une region geographique */
  Metropole = 'MET',
  /** Collectivite territoriale unique (ex: Corse, Martinique, Guyane) */
  CTU = 'CTU',
  /** Communaute d'agglomerations */
  CA = 'CA',
  /** Communaute de communes */
  CC = 'CC',
  /** Etablissement public territorial */
  EPT = 'EPT',
}

export enum OrderMagnitudeMonetaryUnit {
  Thousands = "en milliers d'€",
  Millions = "en millions d'€",
  Billions = "en milliards d'€",
}

export enum ScopeType {
  Departement = "departemental",
  Region = "regional",
  Nation = "national",
}