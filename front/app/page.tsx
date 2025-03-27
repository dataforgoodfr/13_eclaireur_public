import FranceMap from '@/components/open-tiles';
import HomepageHeader from '@/components/HomepageHeader';
import CtaGroup from '@/components/cta/CtaGroup';
export default async function Home() {
  return (
    <>
      <HomepageHeader />
      <CtaGroup />
      <div className='global-margin my-20 w-full flex items-center justify-between mx-auto'>
        <div className='place-self-start'>
          <h3 className='font-semibold text-2xl'>
            Explorer par région
          </h3>
        </div>
      <FranceMap />
      </div>
      
    </>
  );
}
