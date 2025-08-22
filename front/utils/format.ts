import { CommunityType } from './types';

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
  } catch (_err) {
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
