import { fetchCommunities } from '@/utils/fetchers/communities/fetchCommunities-server';

type CommunityPageProps = { params: Promise<{ siren: string }> };

async function getCommunity(siren: string) {
  const communitiesResults = await fetchCommunities({ siren });

  if (communitiesResults.length === 0) {
    throw new Error(`Community doesnt exist with siren ${siren}`);
  }

  return communitiesResults[0];
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const siren = (await params).siren;

  const community = await getCommunity(siren);

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
      </div>
    </div>
  );
}
