// TODO - ajouter tous les types
export enum CommunityType {
  Region = 'REG',
  Departement = 'DEP',
}

export type CommunitiesParamsOptions = {
  type: CommunityType | undefined;
  limit: number;
};
