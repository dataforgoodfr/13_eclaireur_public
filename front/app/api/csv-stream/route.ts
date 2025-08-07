// TODO: Replace all `any` types with proper interfaces/types for better type safety.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

import { DataTable } from '#utils/fetchers/constants';

import { getCopyStream } from './utils';

const DEFAULT_FILE_NAME = 'default_file_name.csv';

type CSVParams<T extends Record<string, any>> = {
  table: DataTable;
  columns?: (keyof T)[];
  filters?: Partial<Pick<T, keyof T>>;
  limit?: number;
};

function stringifyColumns(columns?: (string | number | symbol)[]): string {
  if (columns == null) {
    return '*';
  }

  return columns.join(', ');
}

function createSQLQueryParams<T extends Record<string, any>>(params: CSVParams<T>) {
  const values: (number | string)[] = [];

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

    whereConditions.push(`${key} = '${value}'`);
    values.push(value);
  });

  if (whereConditions.length > 0) {
    query += ` WHERE ${whereConditions.join(' AND ')}`;
  }

  const { limit } = params;

  if (limit !== undefined) {
    query += ` LIMIT ${limit}`;
    values.push(limit);
  }

  return [query, values] as const;
}

/**
 * Get streamed copy of table from db
 * @param params
 * @returns
 */
async function getStream<T extends Record<string, any>>(params: CSVParams<T>) {
  const queryParams = createSQLQueryParams(params);

  return await getCopyStream(...queryParams);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName') ?? DEFAULT_FILE_NAME;
    const table = searchParams.get('table');
    const columns = searchParams.getAll('columns');
    const filters = searchParams.getAll('filters');
    const limit = Number(searchParams.get('limit'));

    if (!table || !Object.values(DataTable).includes(table as DataTable)) {
      throw new Error('The table chosen does not exist - ' + table);
    }

    const stream = await getStream<Record<string, any>>({
      table: table as DataTable,
      columns,
      filters,
      limit,
    });

    const headers = new Headers({
      'Content-Disposition': `attachment; filename=${fileName}`,
      'Content-Type': 'text/csv',
    });

    return new NextResponse(stream, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error fetching CSV:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while fetching CSV' },
      { status: 500 },
    );
  }
}
