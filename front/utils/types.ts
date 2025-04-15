

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


export type YearOption = number | 'All';

export type Sector = {
  name: string;
  size: number;
  part: number;
  pourcentageCategoryTop1: number;
};

export type TreeLeaf = {
  type: 'leaf';
  name: string;
  value: number;
  part?:number;
  pourcentageCategoryTop1?:number;
};

export type TreeNode = {
  type: 'node';
  value: number;
  name: string;
  children: TreeData[];
  part?:number;
  pourcentageCategoryTop1?:number;
};

export type TreeData = TreeNode | TreeLeaf;

export type TooltipProps = {
  visible?: boolean;
  x: number;
  y: number;
  name: string;
  value: number;
};