import { AdminType } from '../types';

// used for map interactions
const getAdminTypeFromLayerId = (layerId: string): AdminType => {
  if (layerId === 'communes') return 'commune';
  if (layerId === 'departements') return 'departement';
  return 'region';
};

export default getAdminTypeFromLayerId;
