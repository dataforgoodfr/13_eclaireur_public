import HomepageHeader from '@/components/HomepageHeader';
import CtaGroup from '@/components/cta/CtaGroup';
import { fetchCommunities } from '@/utils/fetchers/communities/fetchCommunities-server';

export default async function Home() {
  const communities = await fetchCommunities({ selectors: ['nom', 'siren'] });

  console.log({ communities });

  return (
    <>
      <HomepageHeader communities={communities} />
      <CtaGroup />
    </>
  );
}
