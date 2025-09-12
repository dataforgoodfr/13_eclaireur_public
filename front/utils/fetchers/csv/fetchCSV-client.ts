import { downloadURL } from '#utils/downloader/downloadURL';

import type { DataTable } from '../constants';

const API_ROUTE = '/api/csv-stream';

export type CSVParams<T extends Record<string, unknown>> = {
  table: DataTable;
  columns?: (keyof T)[];
  filters?: Partial<Pick<T, keyof T>>;
  limit?: number;
  fileName?: string;
};

function objectToURLSearchParams(obj?: Record<string, unknown>): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (!obj) return searchParams;

  for (const key in obj) {
    if (key in obj && obj[key] != null) {
      const value = obj[key];
      if (typeof value !== 'object' && !Array.isArray(value)) {
        searchParams.append(key, encodeURIComponent(String(value)));
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        for (const subValue of Object.values(value)) {
          if (subValue != null) {
            searchParams.append(key, encodeURIComponent(String(subValue)));
          }
        }
      } else if (Array.isArray(value)) {
        for (const arrayValue of value) {
          if (arrayValue != null) {
            searchParams.append(key, encodeURIComponent(String(arrayValue)));
          }
        }
      }
    }
  }

  return searchParams;
}

export function createCSVDownloadingLink<T extends Record<string, unknown>>(
  params: CSVParams<T>,
): URL {
  const url = new URL(API_ROUTE, window.location.origin);
  url.search = objectToURLSearchParams(params).toString();

  return url;
}

export async function fetchCSV<T extends Record<string, unknown>>(params: CSVParams<T>) {
  const url = createCSVDownloadingLink(params);

  const res = await fetch(url.toString(), { method: 'GET' });

  if (!res.ok) {
    throw new Error('Failed to fetch CSV');
  }

  return res;
}

export function downloadCSV<T extends Record<string, unknown>>(params: CSVParams<T>) {
  const url = createCSVDownloadingLink(params);

  downloadURL(url);
}
