import HomePageHeader from '@/components/HomePageHeader';
import CtaGroup from '@/components/cta/CtaGroup';
import ProjectDescription from '@/components/ProjectDescription';

export default async function Home() {
  return (
    <>
      <HomePageHeader />
      <CtaGroup />
      <ProjectDescription />
    </>
  );
}
