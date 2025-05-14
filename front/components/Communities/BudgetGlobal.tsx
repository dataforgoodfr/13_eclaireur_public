import { fetchCommunityAccounts } from '@/utils/fetchers/communities-accounts/fetchCommunities-server';
import { formatPrice } from '@/utils/utils';

export default async function BudgetGlobal({ communitySiren }: { communitySiren: string }) {
  async function getCommunityAccounts(siren: string) {
    const communitiesAccountsResults = await fetchCommunityAccounts({ filters: { siren } });
    if (communitiesAccountsResults.length === 0) {
      throw new Error(`Community doesnt exist with siren ${siren}`);
    }
    return communitiesAccountsResults[0];
  }
  const communityAccount = await getCommunityAccounts(communitySiren);
  const { total_charges } = communityAccount;
  console.log('communityAccount => ', communityAccount);
  return (
    <div className='right max-w-[300] px-4 py-2 font-bold'>
      Budget Global : <span>{formatPrice(total_charges)}</span>
    </div>
  );
}
