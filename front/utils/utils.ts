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


function formatFrench(value: number, options?: Intl.NumberFormatOptions) {
  const formatter = new Intl.NumberFormat('fr-FR', options);
  const formattedNumber = formatter.format(value);
  return formattedNumber;
}

export function formatNumber2(value: number, options?: Intl.NumberFormatOptions) {
  const defaultOptions = {
    maximumFractionDigits: 2,
    ...options,
  } as const;
  return formatFrench(value, defaultOptions);
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  const defaultOptions = {
    notation: "compact",
    currency: "EUR",
    style: "currency",
    maximumFractionDigits: 1,
    ...options,
  } as const;

  return formatFrench(value, defaultOptions).replace(/\s?€/, "€");
}

export function formatNumberFrench(number: number): string {
  let options = {
    currency: "EUR" as const,
    style: "currency" as const,
    maximumFractionDigits: 0,
  };

  let frenchformatter = new Intl.NumberFormat("fr-FR", options);
  let FRformattedNumber = frenchformatter.format(number);

  return FRformattedNumber;
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