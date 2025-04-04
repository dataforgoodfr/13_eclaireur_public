import { Community } from '@/app/models/community';
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
  console.log('minifiche communitySiren => ', communitySiren);
  console.log('minifiche community !!! => ', community);
  const { nom, siren, type, code_region, population } = community;
  // TODO : retrieve nom du département
  // TODO : retrieve nom de la région
  // const nomRegion = code_region ? await getCommunity(code_region) : null;
  // console.log('nomRegion => ', nomRegion);
  // TODO : prévoir exceptions quand ville = département comme Paris
  return (
    <div className='right min-w-1/4 px-4 py-2'>
      <article>
        <h3 className='text-2xl font-bold'>{nom}</h3>
        <p>Ville {type}</p>
        <p>Loire-Atlantique (44), Pays-de-la-Loire</p>
        <p>{community.population} habitants</p>
      </article>
    </div>
  );
}
