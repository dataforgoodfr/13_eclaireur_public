import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { GRAPH_START_YEAR } from './constants';
import type { Direction } from './fetchers/types';
import { CommunityType } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Create a url with the base url as a prefix
 * @param url
 * @returns
 */
export function withBaseURL(url: string) {
  return process.env.NEXT_PUBLIC_BASE_URL + url;
}

export function debounce<A = unknown, R = void>(
  fn: (args: A) => R,
  ms: number,
): (args: A) => Promise<R> {
  let timer: NodeJS.Timeout;

  return (args: A): Promise<R> =>
    new Promise((resolve) => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        resolve(fn(args));
      }, ms);
    });
}

export function roundNumber(value: number, decimalsCount = 2) {
  const multiplier = Math.pow(10, decimalsCount);

  return Math.round(value * multiplier) / multiplier;
}

export function parseNumber(value: string | null) {
  if (value === null) return undefined;

  const parsedValued = Number(value);
  if (isNaN(parsedValued)) return undefined;

  return parsedValued;
}

function formatFrench(value: number, options?: Intl.NumberFormatOptions) {
  const formatter = new Intl.NumberFormat('fr-FR', options);
  const formattedNumber = formatter.format(value);
  return formattedNumber;
}

export function formatCompact(amount: number) {
  return formatNumber(amount, {
    notation: 'compact',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

export function formatAmount(amount: number) {
  return formatNumber(amount, {
    notation: 'compact',
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  });
}

export function formatCompactPrice(value: number, options?: Intl.NumberFormatOptions): string {
  const defaultOptions = {
    notation: 'compact',
    currency: 'EUR',
    style: 'currency',
    maximumFractionDigits: 1,
    ...options,
  } as const;

  return formatFrench(value, defaultOptions).replace(/\s?€/, '€');
}

/**
 * Formate un montant en milliards d'euros avec notation explicite "Md€".
 * Plus robuste que Intl compact qui peut sortir "Bn€" selon la version ICU.
 * Ex : 1_100_000_000 → "1,1 Md€"
 */
export function formatMilliardsPrice(value: number): string {
  const md = value / 1_000_000_000;
  const formatted = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(md);
  return `${formatted} Md€`;
}

export function formatCompactPriceInteger(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  const defaultOptions = {
    notation: 'compact',
    currency: 'EUR',
    style: 'currency',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    ...options,
  } as const;

  return formatFrench(value, defaultOptions).replace(/\s?€/, '€');
}

/**
 * Determine the appropriate unit (M€ or k€) based on max value
 */
export function getMonetaryUnit(maxValue: number): 'M€' | 'k€' {
  return maxValue >= 1000000 ? 'M€' : 'k€';
}

/**
 * Get the divisor for the unit (1000000 for M€, 1000 for k€)
 */
export function getMonetaryDivisor(unit: 'M€' | 'k€'): number {
  return unit === 'M€' ? 1000000 : 1000;
}

/**
 * Format a value with the appropriate unit, max 1 decimal place
 */
export function formatMonetaryValue(value: number, unit: 'M€' | 'k€'): string {
  const divisor = getMonetaryDivisor(unit);
  const normalizedValue = value / divisor;
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(normalizedValue);
}

export function formatPrice(value: number, options?: Intl.NumberFormatOptions): string {
  const defaultOptions = {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    ...options,
  } as const;
  return formatFrench(value, defaultOptions);
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  const defaultOptions = {
    minimumFractionDigits: 2,
    ...options,
  } as const;

  return formatFrench(value, defaultOptions);
}

export function formatNumberInteger(value: number, options?: Intl.NumberFormatOptions): string {
  const defaultOptions = {
    maximumFractionDigits: 0,
    ...options,
  } as const;

  return formatFrench(value, defaultOptions);
}

export function formatFirstLetterToUppercase(str: string): string {
  if (!str?.trim()) return '';
  if (str.length === 1) return str.toUpperCase();
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatSentenceCase(str: string): string {
  if (!str?.trim()) return '';

  // Split by sentence delimiters and format each sentence
  return str
    .toLowerCase()
    .replace(
      /(^|\. |\? |! )([a-z])/g,
      (match, separator, letter) => separator + letter.toUpperCase(),
    )
    .replace(/^./, (match) => match.toUpperCase());
}

export function formatNomsPropres(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (l, index, str) => {
    const word = str.slice(index).split(/\s/)[0];
    const lowerCaseWords = ['de', 'du', 'des', 'le', 'la', 'les', 'et', 'en', 'au', 'aux'];
    if (index > 0 && lowerCaseWords.includes(word.toLowerCase())) {
      return l.toLowerCase();
    }
    return l.toUpperCase();
  });
}

export function stringifyCommunityType(type: CommunityType): string {
  if (type === CommunityType.Commune) return 'Commune';
  if (type === CommunityType.Departement) return 'Département';
  if (type === CommunityType.Region) return 'Région';
  if (type === CommunityType.GRP) return 'Groupement';

  throw new Error(`Type ${type} not supported`);
}

export function getSortedCommunityTypes(types: CommunityType[]): CommunityType[] {
  return types.sort((a, b) => {
    const labelA = stringifyCommunityType(a);
    const labelB = stringifyCommunityType(b);
    return labelA.localeCompare(labelB, 'fr');
  });
}

export function parseDirection(value: string | null): Direction | undefined {
  if (value === null) return undefined;
  if (value === 'ASC') return 'ASC';
  if (value === 'DESC') return 'DESC';

  return undefined;
}

export function getAllYearsFrom2018ToCurrent(): number[] {
  const years: number[] = [];
  let year: number = new Date().getFullYear();
  while (year >= GRAPH_START_YEAR) {
    years.push(year);
    year--;
  }
  return years;
}

export function getNextTranche(currentTranche: number): number {
  const trancheValues = [0, 1, 3, 6, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
  return trancheValues[trancheValues.indexOf(currentTranche) + 1];
}
