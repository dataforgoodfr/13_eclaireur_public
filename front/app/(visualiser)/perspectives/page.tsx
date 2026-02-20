import { Metadata } from 'next';
import Link from 'next/link';

import { SectionHeader } from '#app/components/SectionHeader';
import {
  fetchMpScoreDistribution,
  fetchPerspectivesKPIs,
  fetchSubScoreDistribution,
  fetchYearlyVolumes,
} from '#utils/fetchers/perspectives/fetchPerspectivesData';

import PerspectivesKPICards from './components/PerspectivesKPIs';
import ScoreByTypeChart from './components/ScoreByTypeChart';
import ScoreDistributionChart from './components/ScoreDistributionChart';
import VolumeChart from './components/VolumeChart';

export const metadata: Metadata = {
  title: 'Perspectives — Transparence des collectivités locales',
  description:
    'État des lieux et perspectives sur la transparence des dépenses publiques locales en France. Données dynamiques sur les marchés publics et subventions.',
  openGraph: {
    title: 'Perspectives — Transparence des collectivités locales | Éclaireur Public',
    description:
      'État des lieux et perspectives sur la transparence des dépenses publiques locales en France. Données dynamiques sur les marchés publics et subventions.',
  },
};

// Revalidate every hour — avoids hammering the DB on every page load
export const revalidate = 3600;

export default async function Page() {
  const [kpis, mpDistribution, subDistribution, volumes] = await Promise.all([
    fetchPerspectivesKPIs(),
    fetchMpScoreDistribution(),
    fetchSubScoreDistribution(),
    fetchYearlyVolumes(),
  ]);

  const referenceYear = kpis.referenceYear;

  return (
    <>
      <SectionHeader
        sectionTitle='Perspectives'
        sectionSubTitle='État des lieux sur la transparence des dépenses publiques locales'
      />
      <main>
        {/* Intro */}
        <div className='section-format'>
          <h2 className='mb-6'>
            Championne d&apos;Europe de l&apos;open data, mais dans les faits ?
          </h2>
          <div className='max-w-3xl space-y-3 text-lg'>
            <p>
              La France se classe{' '}
              <Link
                href='https://data.europa.eu/sites/default/files/odm2024_full_report.pdf'
                className='font-medium underline hover:opacity-70'
                target='_blank'
              >
                au premier rang européen
              </Link>{' '}
              de l&apos;open data pour la quatrième année consécutive, et deuxième au niveau mondial
              dans le{' '}
              <Link
                href='https://www.oecd.org/content/dam/oecd/en/publications/reports/2023/12/2023-oecd-open-useful-and-re-usable-data-ourdata-index_cc9e8a9e/a37f51c3-en.pdf'
                className='font-medium underline hover:opacity-70'
                target='_blank'
              >
                OurData Index
              </Link>{' '}
              de l&apos;OCDE. Pourtant, ce classement reflète surtout l&apos;ambition de l&apos;État
              central.
            </p>
            <p>
              Au niveau local, la réalité est bien différente. Depuis la loi pour une République
              numérique de 2016, les collectivités territoriales doivent publier leurs données de
              dépenses en open data. Mais la majorité ne le fait pas ou peu. Les chiffres
              ci-dessous, calculés en temps réel, le montrent.
            </p>
          </div>
        </div>

        {/* Section 1 : KPIs */}
        <div className='section-format'>
          <h2 className='mb-6'>Peu de collectivités publient, encore moins sur les subventions</h2>
          <PerspectivesKPICards kpis={kpis} />
        </div>

        {/* Section 2 : Comparaison par type de collectivité */}
        <div className='section-format'>
          <h2 className='mb-4'>Départements et régions en tête, communes à la traîne</h2>
          <p className='mb-6 max-w-3xl text-muted-foreground'>
            Le niveau de transparence varie fortement selon le type de collectivité. Les
            départements et régions publient davantage, tandis que les communes — qui représentent
            la grande majorité des collectivités — restent très en retard.
          </p>
          <ScoreByTypeChart
            mpDistribution={mpDistribution}
            subDistribution={subDistribution}
            year={referenceYear}
          />
        </div>

        {/* Section 3 : Distribution des scores */}
        <div className='section-format'>
          <h2 className='mb-4'>
            Les marchés publics progressent, les subventions restent un angle mort
          </h2>
          <p className='mb-6 max-w-3xl text-muted-foreground'>
            La transparence sur les marchés publics s&apos;améliore d&apos;année en année, avec de
            plus en plus de collectivités obtenant des scores C ou mieux. En revanche, la
            quasi-totalité des collectivités obtiennent un score E sur les subventions, signe
            d&apos;une publication quasi inexistante.
          </p>
          <ScoreDistributionChart
            mpDistribution={mpDistribution}
            subDistribution={subDistribution}
          />
        </div>

        {/* Section 4 : Évolution des volumes */}
        <div className='section-format'>
          <h2 className='mb-4'>
            La déclaration des marchés publics décolle&nbsp;; les subventions restent à l&apos;arrêt
          </h2>
          <p className='mb-6 max-w-3xl text-muted-foreground'>
            Depuis 2016, le volume de marchés publics déclarés a été multiplié par plus de dix, et
            le nombre d&apos;acheteurs actifs suit la même tendance &mdash; un signal encourageant.
            Sur les subventions, la dynamique est toute autre&nbsp;: moins de 1&nbsp;% des
            collectivités publient des données exploitables, et les volumes stagnent d&apos;une
            année à l&apos;autre.
          </p>
          <VolumeChart volumes={volumes} />
        </div>

        {/* CTA */}
        <div className='section-format bg-primary/5'>
          <h2 className='mb-4'>Agir pour la transparence</h2>
          <p className='mb-6 max-w-3xl text-muted-foreground'>
            Les communes, qui représentent 96&nbsp;% des collectivités, sont les plus en retard sur
            la publication de leurs données. Les départements et régions font mieux, mais il reste
            encore beaucoup de chemin à parcourir, notamment sur les subventions.
          </p>
          <div className='flex flex-wrap gap-3'>
            <Link
              href='/map'
              className='rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'
            >
              Explorer la carte
            </Link>
            <Link
              href='/advanced-search'
              className='rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'
            >
              Recherche avancée
            </Link>
            <Link
              href='/interpeller'
              className='rounded-lg border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted'
            >
              Interpeller ma collectivité
            </Link>
          </div>
        </div>

        {/* Mentions légales / sources */}
        <div className='mx-4 mb-8 text-sm text-muted-foreground md:mx-8 xl:mx-auto xl:max-w-[1128px]'>
          <p>
            Les données présentées sont issues de{' '}
            <Link href='https://data.gouv.fr' className='underline hover:opacity-70'>
              data.gouv.fr
            </Link>{' '}
            et du{' '}
            <Link
              href='https://www.data.gouv.fr/fr/datasets/donnees-essentielles-de-la-commande-publique-fichiers-consolides/'
              className='underline hover:opacity-70'
            >
              fichier consolidé des DECP
            </Link>
            . Le cadre légal est défini par la{' '}
            <Link href='/cadre-reglementaire' className='underline hover:opacity-70'>
              loi pour une République numérique de 2016
            </Link>
            . Pour en savoir plus sur notre méthodologie de notation, consultez la page{' '}
            <Link href='/methodologie' className='underline hover:opacity-70'>
              Méthodologie
            </Link>
            .
          </p>
        </div>
      </main>
    </>
  );
}
