import FranceMap from '@/components/open-tiles';
import HomePageHeader from '@/components/HomePageHeader';
import CtaGroup from '@/components/cta/CtaGroup';
export default async function Home() {
  return (
    <>
      <HomePageHeader />
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
