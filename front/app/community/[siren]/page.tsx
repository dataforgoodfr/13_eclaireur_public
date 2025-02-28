import db from '@/utils/db';

// Interface pour typer les données de communauté
interface Community {
  siren: string;
  nom: string;
  type: string;
  population: number;
  longitude: number;
  latitude: number;
}

async function getCommunityBySiren(siren: string) {
  const client = await db.connect();
  try {
    const { rows } = await client.query('SELECT * FROM selected_communities WHERE siren = $1', [
      siren,
    ]);
    return rows[0]; // return the first (and only) result since siren is unique
  } finally {
    client.release();
  }
}

export default async function CommunityPage({ params }: { params: Promise<{ siren: string }> }) {
  const siren = (await params).siren;

  const community = await getCommunityBySiren(siren);

  if (!community) {
    return <div>Community not found</div>;
  }
  return (
    <div className='community-page'>
      <div className='community-details'>
        <h1>{community.nom}</h1>
        <p>
          <strong>SIREN:</strong> {community.siren}
        </p>
        <p>
          <strong>Type:</strong> {community.type}
        </p>
        <p>
          <strong>Population:</strong> {community.population}
        </p>
        <p>
          <strong>Location:</strong> ({community.latitude}, {community.longitude})
        </p>
      </div>
    </div>
  );
}
