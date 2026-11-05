import db from '#utils/db';
import { nodeStreamToStream } from '#utils/nodeStreamToStream';
import { to } from 'pg-copy-streams';
import { as } from 'pg-promise';

async function getStreamedQueryCopyFromPool(
  query: string,
  values: (string | number | undefined)[],
) {
  const client = await db.connect();

  try {
    const formattedQuery = as.format(query, values);
    const stream = client.query(to(formattedQuery));

    // Release the client only once the COPY stream is finished; releasing it right away
    // (as before) handed a busy connection back to the pool mid-stream.
    let released = false;
    const release = (err?: Error) => {
      if (released) return;
      released = true;
      client.release(err);
    };
    stream.on('end', () => release());
    stream.on('error', (err) => release(err));
    stream.on('close', () => release());

    return stream;
  } catch (error) {
    client.release();
    throw error;
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
