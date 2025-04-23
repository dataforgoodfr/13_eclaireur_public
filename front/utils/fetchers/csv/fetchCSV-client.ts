import { downloadURL } from '@/utils/downloader/downloadURL';

import { DataTable } from '../constants';

const API_ROUTE = 'api/csv-stream';

export type CSVParams<T extends Record<string, any>> = {
  table: DataTable;
  columns?: (keyof T)[];
  filters?: Partial<Pick<T, keyof T>>;
  limit?: number;
  fileName?: string;
};

function objectToURLSearchParams(obj?: Record<string, any>): URLSearchParams {
  const searchParams = new URLSearchParams();

  for (const key in obj) {
    if (key in obj) {
      if (typeof obj[key] !== 'object' && !Array.isArray(obj[key])) {
        searchParams.append(key, encodeURIComponent(obj[key]));
      } else {
        for (const value of Object.values(obj[key])) {
          searchParams.append(
            key,
            encodeURIComponent(value as unknown as string | number | boolean),
          );
        }
      }
    }
  }

  return searchParams;
}

export function createCSVDownloadingLink<T extends Record<string, any>>(params: CSVParams<T>): URL {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const url = new URL(API_ROUTE, baseURL);
  url.search = objectToURLSearchParams(params).toString();

  return url;
}

export async function fetchCSV<T extends Record<string, any>>(params: CSVParams<T>) {
  const url = createCSVDownloadingLink(params);

  await fetch(url.toString());
}

export function downloadCSV<T extends Record<string, any>>(params: CSVParams<T>) {
  const url = createCSVDownloadingLink(params);

  downloadURL(url);
}
