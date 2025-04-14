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

export function formatNumber1(number: number): string {
  if (number >= 1000_000_000) {
    return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + ' Md€';
  } else if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' M€';
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(1).replace(/\.0$/, '') + ' k€';
  } else {
    return number.toLocaleString('fr-FR') + ' €';
  }
}

export function formatNumber(number: number): string {
  let options = {
    notation: "compact" as const,
    currency: "EUR" as const,
    style: "currency" as const,
    maximumFractionDigits: 1,
  };

  let frenchformatter = new Intl.NumberFormat("fr-FR", options);
  let FRformattedNumber = frenchformatter.format(number);

  return FRformattedNumber;
}

