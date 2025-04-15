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


export function formatNumber(number: number): string {
  let options = {
    notation: "compact" as const,
    currency: "EUR" as const,
    style: "currency" as const,
    maximumFractionDigits: 1,
  };

  let frenchformatter = new Intl.NumberFormat("fr-FR", options);
  let FRformattedNumber = frenchformatter.format(number);

  return FRformattedNumber.replace(/\s?€/, "€");
}

