/**
 * Fetches region data by region codes
 * @param regionCodes - Array of region codes to fetch
 * @returns Array of region data
 */
export async function fetchRegionsByCode(regionCodes: string[]) {
  try {
    if (!regionCodes.length) return [];

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || '';

    // Use URLSearchParams with multiple entries
    const query = new URLSearchParams();
    regionCodes.forEach((code) => {
      query.append('codes', code);
    });

    const res = await fetch(`${baseURL}/api/map/regions?${query.toString()}`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch regions: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Fetched regions data:', data.regions);
    return data.regions || [];
  } catch (err) {
    console.error('Failed to fetch regions data', err);
    return [];
  }
}

/**
 * Fetches departement data by departement codes
 * @param departementCodes - Array of departement codes to fetch
 * @returns Array of departement data
 */
export async function fetchDepartementsByCode(departementCodes: string[]) {
  try {
    if (!departementCodes.length) return [];

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || '';

    // Use URLSearchParams with multiple entries
    const query = new URLSearchParams();
    departementCodes.forEach((code) => {
      query.append('codes', code);
    });

    const res = await fetch(`${baseURL}/api/map/departements?${query.toString()}`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch departements: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.departements || [];
  } catch (err) {
    console.error('Failed to fetch departements data', err);
    return [];
  }
}

/**
 * Fetches commune data by commune codes
 * @param communeCodes - Array of commune codes to fetch
 * @returns Array of commune data
 */
export async function fetchCommunesByCode(communeCodes: string[]) {
  try {
    if (!communeCodes.length) return [];

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || '';

    // Use POST request with codes in the request body
    const res = await fetch(`${baseURL}/api/map/communes`, {
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
  } catch (err) {
    console.error('Failed to fetch communes data', err);
    return [];
  }
}
