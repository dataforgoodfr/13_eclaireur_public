import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export function formatNumber(number: number): string {
  return number.toLocaleString('fr-FR');
}

export function stringifyCommunityType(type: CommunityType): string {
  if (type === CommunityType.CA) return `Communaute d'agglomerations`;
  if (type === CommunityType.CC) return 'Communaute de communes';
  if (type === CommunityType.CTU) return 'Collectivite territoriale unique';
  if (type === CommunityType.Commune) return 'Commune';
  if (type === CommunityType.Departement) return 'Departement';
  if (type === CommunityType.EPT) return 'Etablissement public territorial';
  if (type === CommunityType.Metropole) return 'Metropole';
  if (type === CommunityType.Region) return 'Region';

  throw new Error(`Type ${type} not supported`);
}
