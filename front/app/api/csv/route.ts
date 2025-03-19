import { NextResponse } from 'next/server';

import { MarchePublic } from '@/app/models/marche_public';
import { getQueryFromPool } from '@/utils/db';
import { DataTable } from '@/utils/fetchers/constants';
import { CommunityType } from '@/utils/types';

const DEFAULT_FILENAME = 'default_filename.csv';

type CSVParams<T extends Record<string, any>> = {
  table: DataTable;
  columns?: (keyof T)[];
  filters?: Partial<Pick<T, keyof T>>;
  limit?: number;
};

function convertJSONToCSV(jsonData: any[], delimiter = '|'): string {
  const headers = Object.keys(jsonData[0]).join(delimiter);
  console.log({ jsonData });
  const rows = jsonData.map((obj) => Object.values(obj).join(delimiter).replace('\n', ' '));

  return `${headers}\n${rows.join('\n')}`;
}

function stringifyColumns(columns?: (string | number | symbol)[]): string {
  if (columns == null) {
    return '*';
  }

  return columns.join(', ');
}

function createSQLQueryParams<T extends Record<string, any>>(params: CSVParams<T>) {
  let values: (number | string)[] = [];

  const selectorsStringified = stringifyColumns(params?.columns);
  let query = `SELECT ${selectorsStringified} FROM ${params.table}`;

  const { filters } = params;

  const whereConditions: string[] = [];

  const keys = Object.keys(filters ?? {});

  keys.forEach((key) => {
    const value = filters?.[key] as unknown as any;
    if (value == null) {
      console.error(`${key} with value is null or undefined in the query ${query}`);

      return;
    }

    whereConditions.push(`${key} = $${values.length + 1}`);
    values.push(value);
  });

  if (whereConditions.length > 0) {
    query += ` WHERE ${whereConditions.join(' AND ')}`;
  }

  const { limit } = params;

  if (limit !== undefined) {
    query += ` LIMIT $${values.length + 1}`;
    values.push(limit);
  }

  return [query, values] as const;
}

/**
 * Download CSV from db
 * @param params
 * @returns
 */
async function fetchCSV<T extends Record<string, any>>(params: CSVParams<T>) {
  const queryParams = createSQLQueryParams(params);

  const rows = await getQueryFromPool(...queryParams);

  if (rows === undefined) {
    throw new Error('No rows found in query');
  }

  const outputCSV = convertJSONToCSV(rows);

  return outputCSV;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') ?? DEFAULT_FILENAME;

    const data = await fetchCSV<MarchePublic>({
      table: DataTable.MarchesPublics,
      columns: ['acheteur_siren', 'objet', 'acheteur_type'],
      filters: { acheteur_type: CommunityType.Commune },
      limit: 10,
    });

    const headers = new Headers({
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Type': 'text/csv',
    });

    return new NextResponse(data, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Database error: ', error);
    return NextResponse.json(
      { error: 'Internal Server Error while fetching CSV' },
      { status: 500 },
    );
  }
}
