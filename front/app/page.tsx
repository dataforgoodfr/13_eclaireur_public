import FranceMap from '@/components/open-tiles';
import HomepageHeader from '@/components/HomepageHeader';
import CtaGroup from '@/components/cta/CtaGroup';
export default async function Home() {
  return (
    <>
      <HomepageHeader />
      <CtaGroup />
      <div className='my-20 w-full flex items-center justify-center'>
      <FranceMap />
      </div>
      
    </>
  );
}
