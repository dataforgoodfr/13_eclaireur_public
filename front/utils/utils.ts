import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Direction } from './fetchers/types';
import { CommunityType } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function formatPrice(value: number, options?: Intl.NumberFormatOptions): string {
  const defaultOptions = {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
    ...options,
  } as const;
  return formatFrench(value, defaultOptions);
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  const defaultOptions = {
    maximumFractionDigits: 2,
    ...options,
  } as const;
  
  return formatFrench(value, defaultOptions)};


export function formatFirstLetterToUppercase(str: string): string {
  if (!str?.trim()) return '';
  if (str.length === 1) return str.toUpperCase();
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function stringifyCommunityType(type: CommunityType): string {
  if (type === CommunityType.CA) return `Communauté d'agglomeration`;
  if (type === CommunityType.CC) return 'Communauté de communes';
  if (type === CommunityType.CTU) return 'Collectivité territoriale unique';
  if (type === CommunityType.Commune) return 'Commune';
  if (type === CommunityType.Departement) return 'Département';
  if (type === CommunityType.EPT) return 'Établissement public territorial';
  if (type === CommunityType.Metropole) return 'Métropole';
  if (type === CommunityType.Region) return 'Région';

  throw new Error(`Type ${type} not supported`);
}

export function parseDirection(value: string | null): Direction | undefined {
  if (value === null) return undefined;
  if (value === 'ASC') return 'ASC';
  if (value === 'DESC') return 'DESC';

  return undefined;
}
