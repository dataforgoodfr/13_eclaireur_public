import HomePageHeader from '@/components/HomePageHeader';
import ProjectDescription from '@/components/ProjectDescription';
import CtaGroup from '@/components/cta/CtaGroup';

export default async function Home() {
  return (
    <>
      <HomePageHeader />
      <CtaGroup />
      <ProjectDescription />
    </>
  );
}
