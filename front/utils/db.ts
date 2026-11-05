import { Pool, QueryConfig } from 'pg';

const db = new Pool({
  user: process.env.POSTGRESQL_ADDON_USER,
  host: process.env.POSTGRESQL_ADDON_HOST,
  database: process.env.POSTGRESQL_ADDON_DB,
  password: process.env.POSTGRESQL_ADDON_PASSWORD,
  port: parseInt(process.env.POSTGRESQL_ADDON_PORT || '5432', 10),
});

export default db;

export async function getQueryFromPool(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryTextOrConfig: string | QueryConfig<any[]>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values?: any[] | undefined,
) {
  const client = await db.connect();
  try {
    const { rows } = await client.query(queryTextOrConfig, values);
    return rows;
  } catch (error) {
    // console.error (not console.log): next.config strips console.log in production builds,
    // which made every DB error invisible in prod logs.
    console.error('[db] query failed', error);
  } finally {
    client.release();
  }
}
