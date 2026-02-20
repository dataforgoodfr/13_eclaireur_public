import { getQueryFromPool } from '#utils/db';

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS interpellation_logs (
    id SERIAL PRIMARY KEY,
    siren VARCHAR(9) NOT NULL,
    community_name TEXT NOT NULL,
    community_type TEXT NOT NULL,
    nb_contacts INTEGER NOT NULL,
    has_copy BOOLEAN NOT NULL DEFAULT false,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

interface InterpellationLogEntry {
  siren: string;
  communityName: string;
  communityType: string;
  nbContacts: number;
  hasCopy: boolean;
}

export async function logInterpellation(entry: InterpellationLogEntry): Promise<void> {
  try {
    await getQueryFromPool(CREATE_TABLE_SQL);

    await getQueryFromPool(
      `INSERT INTO interpellation_logs (siren, community_name, community_type, nb_contacts, has_copy)
       VALUES ($1, $2, $3, $4, $5)`,
      [entry.siren, entry.communityName, entry.communityType, entry.nbContacts, entry.hasCopy],
    );
  } catch (err) {
    console.error('[interpellation-log] Failed to log interpellation:', err);
  }
}
