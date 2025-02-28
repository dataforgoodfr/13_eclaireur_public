// Interface pour typer les données de communauté
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

  const response = await fetch(
    `${process.env.BASE_URL}/api/selected_communities?siren=${siren}&limit=1`,
  );

  // Gestion d'erreur basique
  if (!response.ok) {
    return <div>Erreur lors de la récupération des données</div>;
  }

  // Conversion de la réponse en JSON
  const communities: Community[] = await response.json();

  // Vérification si des données ont été trouvées
  if (communities.length === 0) {
    return <div>Aucune communauté trouvée avec le SIREN {siren}</div>;
  }

  // Récupération de la communauté
  const community = communities[0];

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
