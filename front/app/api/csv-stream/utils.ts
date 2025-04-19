import db from '@/utils/db';
import { nodeStreamToStream } from '@/utils/nodeStreamToStream';
import { to } from 'pg-copy-streams';
import { as } from 'pg-promise';

async function getStreamedQueryCopyFromPool(
  query: string,
  values: (string | number | undefined)[],
) {
  const client = await db.connect();
  const formattedQuery = as.format(query, values);

  try {
    const stream = client.query(to(formattedQuery));
    return stream;
  } finally {
    client.release();
  }
}

/**
 * Get stream as ReadableStream to retrieve a copy of a table
 * @param params
 * @returns
 */
export async function getCopyStream(query: string, values: (string | number | undefined)[]) {
  const queryCopy = `COPY (${query}) TO STDOUT`;

  const queryCopyStream = await getStreamedQueryCopyFromPool(queryCopy, values);

  const readableStream: ReadableStream = nodeStreamToStream(queryCopyStream);

  return readableStream;
}
