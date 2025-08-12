import { downloadURL } from '#utils/downloader/downloadURL';

import { DataTable } from '../constants';

const API_ROUTE = '/api/csv-stream';

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
  const url = new URL(API_ROUTE, window.location.origin);
  url.search = objectToURLSearchParams(params).toString();

  return url;
}

export async function fetchCSV<T extends Record<string, any>>(params: CSVParams<T>) {
  const url = createCSVDownloadingLink(params);

  const res = await fetch(url.toString(), { method: 'GET' });

  if (!res.ok) {
    throw new Error('Failed to fetch CSV');
  }

  return res;
}

export function downloadCSV<T extends Record<string, any>>(params: CSVParams<T>) {
  const url = createCSVDownloadingLink(params);

  downloadURL(url);
}