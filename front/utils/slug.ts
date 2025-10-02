/**
 * SEO URL Slug Generation Utilities
 *
 * Implements the OpenSpec url-routing specification:
 * openspec/changes/add-comprehensive-seo/specs/url-routing/spec.md
 *
 * URL Format: /<type>/<slug>-<siren>
 * Example: /commune/paris-213105554
 */

/**
 * Community type codes used in the database
 */
export type CommunityType =
  | 'COM' // Commune
  | 'REG' // Région
  | 'DEP' // Département
  | 'MET' // Métropole
  | 'CTU' // Collectivité territoriale unique
  | 'CA' // Communauté d'agglomération
  | 'CC' // Communauté de communes
  | 'EPT'; // Établissement public territorial

/**
 * URL type prefixes used in routes
 */
export type TypePrefix =
  | 'commune'
  | 'region'
  | 'departement'
  | 'metropole'
  | 'ctu'
  | 'ca'
  | 'cc'
  | 'ept';

/**
 * Slugify text according to OpenSpec url-routing specification.
 *
 * Algorithm steps:
 * 1. Convert to lowercase
 * 2. Normalize Unicode (NFD) to decompose accents
 * 3. Remove diacritical marks (U+0300 to U+036F)
 * 4. Remove apostrophes
 * 5. Replace spaces with hyphens
 * 6. Remove all non-alphanumeric characters except hyphens
 * 7. Replace multiple consecutive hyphens with single hyphen
 * 8. Trim leading and trailing hyphens
 *
 * @param text - The text to slugify
 * @returns SEO-friendly slug
 *
 * @example
 * slugify('Saint-Étienne-du-Rouvray') // 'saint-etienne-du-rouvray'
 * slugify("L'Haÿ-les-Roses") // 'lhay-les-roses'
 * slugify('Île-de-France') // 'ile-de-france'
 */
export function slugify(text: string): string {
  return text
    .toLowerCase() // Step 1
    .normalize('NFD') // Step 2
    .replace(/[\u0300-\u036f]/g, '') // Step 3: Remove diacritical marks
    .replace(/['']/g, '') // Step 4: Remove apostrophes
    .replace(/\s+/g, '-') // Step 5: Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Step 6: Remove non-alphanumeric except hyphens
    .replace(/-+/g, '-') // Step 7: Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Step 8: Trim leading/trailing hyphens
}

/**
 * Map community type codes to URL prefixes.
 *
 * @param communityType - The community type code from database
 * @returns URL prefix for routing
 *
 * @example
 * getTypePrefix('COM') // 'commune'
 * getTypePrefix('REG') // 'region'
 * getTypePrefix('DEP') // 'departement'
 */
export function getTypePrefix(communityType: CommunityType): TypePrefix {
  const typeMapping: Record<CommunityType, TypePrefix> = {
    COM: 'commune',
    REG: 'region',
    DEP: 'departement',
    MET: 'metropole',
    CTU: 'ctu',
    CA: 'ca',
    CC: 'cc',
    EPT: 'ept',
  };

  return typeMapping[communityType];
}

/**
 * Generate full community slug including type prefix, slugified name, and SIREN.
 *
 * @param name - Community name (e.g., "Paris", "Île-de-France")
 * @param communityType - Community type code
 * @param siren - 9-digit SIREN identifier
 * @returns Full URL slug
 *
 * @example
 * createCommunitySlug('Paris', 'COM', '213105554')
 * // Returns: 'commune/paris-213105554'
 *
 * createCommunitySlug('Île-de-France', 'REG', '111546651')
 * // Returns: 'region/ile-de-france-111546651'
 */
export function createCommunitySlug(
  name: string,
  communityType: CommunityType,
  siren: string,
): string {
  const slug = slugify(name);
  const typePrefix = getTypePrefix(communityType);
  return `${typePrefix}/${slug}-${siren}`;
}

/**
 * Generate full community URL path with leading slash.
 *
 * @param name - Community name
 * @param communityType - Community type code
 * @param siren - 9-digit SIREN identifier
 * @returns Full URL path starting with /
 *
 * @example
 * createCommunityUrl('Paris', 'COM', '213105554')
 * // Returns: '/commune/paris-213105554'
 */
export function createCommunityUrl(
  name: string,
  communityType: CommunityType,
  siren: string,
): string {
  return `/${createCommunitySlug(name, communityType, siren)}`;
}

/**
 * Extract SIREN from a slug parameter.
 *
 * The slug format is: <slug>-<siren>
 * This function extracts the SIREN (last 9 digits after the final hyphen).
 *
 * @param slug - The slug parameter from the URL
 * @returns SIREN identifier or null if invalid
 *
 * @example
 * extractSirenFromSlug('paris-213105554') // '213105554'
 * extractSirenFromSlug('saint-etienne-du-rouvray-217600710') // '217600710'
 * extractSirenFromSlug('invalid') // null
 */
export function extractSirenFromSlug(slug: string): string | null {
  const match = slug.match(/-(\d{9})$/);
  return match ? match[1] : null;
}

/**
 * Parse community type from URL type prefix.
 *
 * @param typePrefix - URL type prefix (e.g., 'commune', 'region')
 * @returns Community type code or null if invalid
 *
 * @example
 * parseCommunityType('commune') // 'COM'
 * parseCommunityType('region') // 'REG'
 * parseCommunityType('invalid') // null
 */
export function parseCommunityType(typePrefix: string): CommunityType | null {
  const reverseMapping: Record<string, CommunityType> = {
    commune: 'COM',
    region: 'REG',
    departement: 'DEP',
    metropole: 'MET',
    ctu: 'CTU',
    ca: 'CA',
    cc: 'CC',
    ept: 'EPT',
  };

  return reverseMapping[typePrefix] || null;
}

/**
 * Validate that a slug matches the expected format.
 *
 * @param slug - The slug to validate
 * @returns true if slug is valid format
 *
 * @example
 * isValidSlug('paris-213105554') // true
 * isValidSlug('saint-etienne-du-rouvray-217600710') // true
 * isValidSlug('invalid') // false
 * isValidSlug('paris') // false (missing SIREN)
 */
export function isValidSlug(slug: string): boolean {
  // Must end with hyphen followed by exactly 9 digits
  return /-\d{9}$/.test(slug);
}

/**
 * Extract the name slug portion (without SIREN) from a full slug.
 *
 * @param slug - The full slug with SIREN
 * @returns Name portion of slug or null if invalid
 *
 * @example
 * extractNameFromSlug('paris-213105554') // 'paris'
 * extractNameFromSlug('saint-etienne-du-rouvray-217600710')
 * // Returns: 'saint-etienne-du-rouvray'
 */
export function extractNameFromSlug(slug: string): string | null {
  if (!isValidSlug(slug)) {
    return null;
  }

  // Remove the SIREN suffix (last hyphen + 9 digits)
  return slug.replace(/-\d{9}$/, '');
}
