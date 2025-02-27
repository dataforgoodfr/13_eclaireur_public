import HomepageHeader from '@/components/HomepageHeader';
import { getCommunities } from '@/utils/fetchers/communities/communities-server';

export default async function Home() {
  const communities = await getCommunities();

  return (
    <>
      <HomepageHeader communities={communities} />
    </>
  );
}
