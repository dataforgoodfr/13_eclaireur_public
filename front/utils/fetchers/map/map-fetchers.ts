// Types for collectivites data structure
interface Collectivite {
  siren: string;
  code_insee?: string;
  code_insee_region?: string;
  nom: string;
  type: string;
  subventions_score?: number;
  mp_score?: number;
  [key: string]: unknown; // For additional fields from the database
}

const API_ROUTES = {
  REGIONS: '/api/map/regions',
  DEPARTEMENTS: '/api/map/departements',
  COMMUNES: '/api/map/communes',
};

/**
 * Fetches region data by region codes
 */
export async function fetchRegionsByCode(regionCodes: string[]): Promise<Collectivite[]> {
  if (!regionCodes.length) return [];

  const url = new URL(API_ROUTES.REGIONS, window.location.origin);
  regionCodes.forEach((code) => url.searchParams.append('codes', code));

  const res = await fetch(url.toString(), { method: 'GET' });

  if (!res.ok) {
    throw new Error(`Failed to fetch regions: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.regions || [];
}

/**
 * Fetches departement data by departement codes
 */
export async function fetchDepartementsByCode(departementCodes: string[]): Promise<Collectivite[]> {
  if (!departementCodes.length) return [];

  const url = new URL(API_ROUTES.DEPARTEMENTS, window.location.origin);
  departementCodes.forEach((code) => url.searchParams.append('codes', code));

  const res = await fetch(url.toString(), { method: 'GET' });

  if (!res.ok) {
    throw new Error(`Failed to fetch departements: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.departements || [];
}

/**
 * Fetches commune data by commune codes
 */
export async function fetchCommunesByCode(communeCodes: string[]): Promise<Collectivite[]> {
  if (!communeCodes.length) return [];

  const url = new URL(API_ROUTES.COMMUNES, window.location.origin);

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ codes: communeCodes }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch communes: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.communes || [];
}
