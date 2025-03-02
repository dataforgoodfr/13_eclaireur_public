// Interface pour typer les données de communauté
import fetchCommunityBySiren from '@/utils/fetchers/fetchCommunityBySiren';

interface Community {
  siren: string;
  nom: string;
  type: string;
  population: number;
  longitude: number;
  latitude: number;
}

export default async function CommunityPage({ params }: { params: Promise<{ siren: string }> }) {
  const siren = (await params).siren;

  const community: Community = await fetchCommunityBySiren(siren);
  return (
    <div className='community-page'>
      <h1>{community.nom}</h1>

      <div className='community-details'>
        <p>
          <strong>SIREN:</strong> {community.siren}
        </p>
        <p>
          <strong>Type:</strong> {community.type}
        </p>
        <p>
          <strong>Population:</strong> {community.population.toLocaleString()} habitants
        </p>
        <p>
          <strong>Coordonnées géographiques:</strong> {community.latitude.toFixed(6)},{' '}
          {community.longitude.toFixed(6)}
        </p>
      </div>
    </div>
  );
}
