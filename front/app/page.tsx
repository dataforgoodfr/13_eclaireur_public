import HomePageHeader from '#app/components/HomePageHeader';
import OurMethodology from '#app/components/OurMethodology';
import ProjectDescription from '#app/components/ProjectDescription';
import WhyChallenge from '#app/components/WhyChallenge';
import CtaGroup from '#app/components/cta/CtaGroup';

export default async function Home() {
  return (
    <>
      <HomePageHeader />
      <CtaGroup />
      <ProjectDescription />
      <WhyChallenge />
      <OurMethodology />
    </>
  );
}
