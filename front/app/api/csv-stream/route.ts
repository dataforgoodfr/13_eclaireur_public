import { NextResponse } from 'next/server';

import db from '@/utils/db';
import { DataTable } from '@/utils/fetchers/constants';
import { nodeStreamToStream } from '@/utils/nodeStreamToStream';
import { to } from 'pg-copy-streams';

const DEFAULT_FILENAME = 'default_filename.csv';

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

async function getQueryCopyFromPool(queryText: string) {
  const client = await db.connect();
  try {
    const stream = client.query(to(queryText));
    return stream;
  } finally {
    client.release();
  }
}

/**
 * Get copy of table from db
 * @param params
 * @returns
 */
async function getCSV<T extends Record<string, any>>(params: CSVParams<T>) {
  const [tableQuery] = createSQLQueryParams(params);

  const query = `COPY (${tableQuery}) TO STDOUT`;

  return await getQueryCopyFromPool(query);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') ?? DEFAULT_FILENAME;
    const table = searchParams.get('table');
    const columns = searchParams.getAll('columns');
    const filters = searchParams.getAll('filters');
    const limit = Number(searchParams.get('limit')) ?? undefined;

    if (!table || !Object.values(DataTable).includes(table as DataTable)) {
      throw new Error('The table chosen does not exist - ' + table);
    }

    const stream = await getCSV<Record<string, any>>({
      table: table as DataTable,
      columns,
      filters,
      limit,
    });

    const readableStream: ReadableStream = nodeStreamToStream(stream);

    const headers = new Headers({
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Type': 'text/csv',
    });

    return new NextResponse(readableStream, {
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
