import { fetchCommunityAccounts } from '@/utils/fetchers/communities-accounts/fetchCommunitiesAccounts-server';
import { formatPrice } from '@/utils/utils';

async function getCommunityAccounts(siren: string) {
  const communitiesAccountsResults = await fetchCommunityAccounts({ filters: { siren } });
  if (communitiesAccountsResults.length === 0) {
    throw new Error(`Community account doesnt exist with siren ${siren}`);
  }
  return communitiesAccountsResults[0];
}
export default async function BudgetGlobal({ communitySiren }: { communitySiren: string }) {
  const communityAccount = await getCommunityAccounts(communitySiren);
  const { total_charges } = communityAccount;
  return (
    <div className='right max-w-[300] px-4 py-2 font-bold'>
      Budget Global : <span>{formatPrice(total_charges)}</span>
    </div>
  );
}
