// TODO: Review and remove unused variables. This file ignores unused vars for now.
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchCommunityAccounts } from '#utils/fetchers/communities-accounts/fetchCommunityAccounts-server';
import { fetchCommunities } from '#utils/fetchers/communities/fetchCommunities-server';
import { fetchContacts } from '#utils/fetchers/contacts/fetchContacts-server';

type CommunityLocalisationCardProps = {
  communitySiren: string;
};
async function getCommunity(siren: string) {
  const communitiesResults = await fetchCommunities({ filters: { siren } });
  if (communitiesResults.length === 0) {
    throw new Error(`Community doesnt exist with siren ${siren}`);
  }
  return communitiesResults[0];
}
async function getCommunityAccounts(siren: string) {
  const communitiesAccountsResults = await fetchCommunityAccounts({ filters: { siren } });
  if (communitiesAccountsResults.length === 0) {
    throw new Error(`Community account doesnt exist with siren ${siren}`);
  }
  return communitiesAccountsResults[0];
}
async function getContacts(siren: string) {
  const contactsResults = await fetchContacts({ filters: { siren } });
  if (contactsResults.length === 0) {
    throw new Error(`Contacts doesnt exist with siren ${siren}`);
  }
  return contactsResults;
}
export const CommunityLocalisationCard = async ({
  communitySiren,
}: CommunityLocalisationCardProps) => {
  const communityAccount = await getCommunityAccounts(communitySiren);
  const { nom_com, nom_reg, nom_dept, dep_clean, type } = communityAccount;
  if (type === 'DEP') {
    return `{nom_reg}`;
  }
  if (type === 'COM') {
    return `${nom_dept} (${dep_clean}), ${nom_reg}`;
  }
  if (type === 'REG') {
    return ``;
  }
  // TODO : handle thess cases
  // Metropole = 'MET',
  // /** Collectivite territoriale unique (ex: Corse, Martinique, Guyane) */
  // CTU = 'CTU',
  // /** Communaute d'agglomerations */
  // CA = 'CA',
  // /** Communaute de communes */
  // CC = 'CC',
  // /** Etablissement public territorial */
  // EPT = 'EPT',
};

export default async function MiniFicheCommunity({ communitySiren }: { communitySiren: string }) {
  const community = await getCommunity(communitySiren);
  const { nom, population, categorie } = community;
  return (
    <div className='right min-w-1/4 px-4 py-2'>
      <article>
        <h3 className='text-2xl font-bold'>{nom}</h3>
        <p>{categorie}</p>
        <p>
          <CommunityLocalisationCard communitySiren={communitySiren} />
        </p>
        <p>{population} habitants</p>
      </article>
    </div>
  );
}
