import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
