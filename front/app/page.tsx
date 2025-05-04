import HomePageHeader from '@/app/components/HomePageHeader';
import ProjectDescription from '@/app/components/ProjectDescription';
import CtaGroup from '@/app/components/cta/CtaGroup';
import FranceMap from '@/components/Map/open-tiles';

export default async function Home() {
  return (
    <>
      <HomePageHeader />
      <CtaGroup />
      <ProjectDescription />
      <div className='global-margin mx-auto my-20 flex w-full items-center justify-between'>
        <div className='place-self-start'>
          <h3 className='text-2xl font-semibold'>Explorer par région</h3>
        </div>
        <FranceMap />
      </div>
    </>
  );
}
