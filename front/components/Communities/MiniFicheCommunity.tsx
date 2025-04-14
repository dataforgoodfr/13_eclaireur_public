import { fetchCommunities } from '@/utils/fetchers/communities/fetchCommunities-server';

async function getCommunity(siren: string) {
  const communitiesResults = await fetchCommunities({ filters: { siren } });
  if (communitiesResults.length === 0) {
    throw new Error(`Community doesnt exist with siren ${siren}`);
  }
  return communitiesResults[0];
}

export default async function MiniFicheCommunity({ communitySiren }: { communitySiren: string }) {
  const community = await getCommunity(communitySiren);
  console.log('community => ', community);
  const { nom, siren, type, population_x: population } = community;
  // TODO : retrieve nom du département
  // TODO : retrieve nom de la région
  return (
    <div className='right min-w-1/4 px-4 py-2'>
      <article>
        <h3 className='text-2xl font-bold'>{nom}</h3>
        <p>Ville {type}</p>
        <p>Loire-Atlantique (44), Pays-de-la-Loire</p>
        <p>{community.population_x} habitants</p>
      </article>
    </div>
  );
}
