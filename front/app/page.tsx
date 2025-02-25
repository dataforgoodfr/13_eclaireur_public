import HomepageHeader from '@/components/HomepageHeader';
import { fetchCommunities } from '@/utils/fetchers/fetchCommunities';

export default async function Home() {
  const communities = await fetchCommunities();
  return (
    <>
      <HomepageHeader communities={communities} />
    </>
  );
}
