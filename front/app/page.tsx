import type { Metadata } from 'next';

import HomePageHeader from '#app/components/HomePageHeader';
import OurMethodologyExtended from '#app/components/OurMethodologyExtended';
import ProjectDescription from '#app/components/ProjectDescription';
import WhyChallenge from '#app/components/WhyChallenge';
import CtaGroup from '#app/components/cta/CtaGroup';

export const metadata: Metadata = {
  title: 'Transparence des finances locales',
  description:
    'Consultez les dépenses publiques de votre collectivité locale : marchés publics, subventions et score de transparence. Une initiative Anticor & Data for Good.',
  openGraph: {
    title: 'Éclaireur Public — Transparence des finances locales',
    description:
      'Consultez les dépenses publiques de votre collectivité locale : marchés publics, subventions et score de transparence. Une initiative Anticor & Data for Good.',
  },
};

export default async function Home() {
  return (
    <>
      <HomePageHeader />
      <CtaGroup />
      <ProjectDescription />
      <WhyChallenge />
      <OurMethodologyExtended />
    </>
  );
}
