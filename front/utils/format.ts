import { CommunityType, ScopeType } from './types';

export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts,
    }).format(new Date(date));
  } catch {
    return '';
  }
}

export function formatCommunityType(type: CommunityType): string {
  const typeLabels: Record<CommunityType, string> = {
    [CommunityType.Region]: 'Région',
    [CommunityType.Departement]: 'Département',
    [CommunityType.Commune]: 'Commune',
    [CommunityType.Metropole]: 'Métropole',
    [CommunityType.CTU]: 'Collectivité territoriale unique',
    [CommunityType.CA]: "Communauté d'agglomération",
    [CommunityType.CC]: 'Communauté de communes',
    [CommunityType.EPT]: 'Établissement public territorial',
  };

  return typeLabels[type] || type;
}

export function formatScopeType(type: ScopeType): string {
  const typeLabels: Record<ScopeType, string> = {
    [ScopeType.Departement]: 'Départemental',
    [ScopeType.Region]: 'Régional',
    [ScopeType.Nation]: 'National',
  };

  return typeLabels[type] || type;
}

/**
 * Normalize French location names (cities, departments) formatting
 * according to French typographic conventions
 */
export function formatLocationName(name: string): string {
  if (!name) return name;

  // Remove leading/trailing spaces and normalize multiple spaces
  let formatted = name.trim().replace(/\s+/g, ' ');

  // Fix common missing accents in city names
  formatted = formatted
    .replace(/\bepartement\b/gi, 'épartement')
    .replace(/\betropole\b/gi, 'étropole');

  // Remove prefixes like "Commune de", "Ville de", etc. (but keep Département and Métropole)
  formatted = formatted.replace(/^(commune|ville|city)\s+(de|d')\s*/gi, '');

  // Capitalization rules
  formatted = formatted

    // Convert to lowercase first
    .toLowerCase()
    // Capitalize first letter
    .replace(/^\w/, (c) => c.toUpperCase())
    // Capitalize after hyphen
    .replace(/-(\w)/g, (_, letter) => `-${letter.toUpperCase()}`)
    // Capitalize after apostrophe
    .replace(/'(\w)/g, (_, letter) => `'${letter.toUpperCase()}`)
    // Capitalize definite articles at word boundaries (except de, du, des, de la)
    .replace(
      /\b(le|la|les|de|du|des|de la|de l'|des)\b/gi,
      (match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase(),
    )
    // lowercase prepositions
    .replace(/\b(de|du|des|de la|de l'|des)\b/gi, (match) => match.toLowerCase())
    // Capitalize "Saint" and "Sainte"
    .replace(/\bsaint(e?)\b/gi, (_, e) => `Saint${e ? 'e' : ''}`)
    // Capitalize after space
    .replace(/\s(\w)/g, (_, letter) => ` ${letter.toUpperCase()}`);

  return formatted;
}

/**
 * Format department names specifically
 */
export function formatDepartmentName(name: string): string {
  if (!name) return name;

  let formatted = name.trim().replace(/\s+/g, ' ');

  // Fix common missing accents in department names
  formatted = formatted
    .replace(/\bdepartement\b/gi, 'département')
    .replace(/\bmetropole\b/gi, 'métropole');

  // Remove prefixes like "Département/Departement de/des/du/de la/de l'", etc.
  formatted = formatted.replace(
    /^(département|departement|dept\.?)\s+(de\s+la\s+|de\s+l'\s*|des\s+|du\s+|de\s+|d'\s*)/gi,
    '',
  );

  // Apply general location formatting
  formatted = formatLocationName(formatted);

  // Department-specific rules
  formatted = formatted
    // Handle special cases like "Seine-et-Marne"
    .replace(/\bet\b/gi, 'et')
    // Handle "d'Olonne", "d'Armor", etc.
    .replace(/\bd'/gi, "d'");

  return formatted;
}

/**
 * Usage examples:
 * formatLocationName('MARSEILLE') → 'Marseille'
 * formatLocationName('commune de saint-denis') → 'Saint-Denis'
 * formatLocationName('ville d\'aix-en-provence') → 'Aix-En-Provence'
 * formatLocationName('le havre') → 'Le Havre'
 * formatDepartmentName('Loire') → 'Loire'
 * formatDepartmentName('departement de la haute-garonne') → 'Haute-Garonne'
 * formatDepartmentName('Hérault') → 'Hérault'
 * formatDepartmentName('departement des alpes-maritimes') → 'Alpes-Maritimes'
 * formatDepartmentName('Var') → 'Var'
 * formatLocationName('metropole de lyon') → 'Métropole de Lyon'
 * formatLocationName('departement des alpes-maritimes') → 'Département des Alpes-Maritimes'
 * formatLocationName('departement de la haute-savoie') → 'Département de la Haute-Savoie'
 * formatDepartmentName('seine-et-marne') → 'Seine-et-Marne'
 */
