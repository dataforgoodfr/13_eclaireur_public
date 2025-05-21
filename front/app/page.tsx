import HomePageHeader from '@/app/components/HomePageHeader';
import ProjectDescription from '@/app/components/ProjectDescription';
import CtaGroup from '@/app/components/cta/CtaGroup';

export default async function Home() {
  return (
    <>
      <HomePageHeader />
      <CtaGroup />
      <ProjectDescription />
    </>
  );
}
