import HomepageHeader from '@/components/HomepageHeader';
import CtaGroup from '@/components/cta/CtaGroup';
import db from '@/utils/db';

async function getCommunities() {
  const client = await db.connect();
  try {
    const { rows } = await client.query('SELECT * FROM selected_communities');
    return rows;
  } finally {
    client.release();
  }
}

export default async function Home() {
  const communities = await getCommunities();
  return (
    <>
      <HomepageHeader communities={communities} />
      <CtaGroup />
    </>
  );
}
