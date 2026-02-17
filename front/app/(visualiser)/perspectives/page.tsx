import { Metadata } from 'next';
import Link from 'next/link';

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
    <main className='mx-auto mb-12 w-full max-w-screen-xl space-y-12 p-6'>
      {/* Header : France championne intégrée à l'intro */}
      <div className='space-y-4'>
        <h1 className='text-3xl font-bold md:text-4xl'>
          Championne d&apos;Europe de l&apos;open data, mais dans les faits ?
        </h1>
        <div className='max-w-3xl space-y-3 text-lg text-muted-foreground'>
          <p>
            La France se classe{' '}
            <Link
              href='https://data.europa.eu/sites/default/files/odm2024_full_report.pdf'
              className='underline hover:text-foreground'
              target='_blank'
            >
              au premier rang européen
            </Link>{' '}
            de l&apos;open data pour la quatrième année consécutive, et deuxième au niveau mondial
            dans le{' '}
            <Link
              href='https://www.oecd.org/content/dam/oecd/en/publications/reports/2023/12/2023-oecd-open-useful-and-re-usable-data-ourdata-index_cc9e8a9e/a37f51c3-en.pdf'
              className='underline hover:text-foreground'
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
            dépenses en open data. Mais la majorité ne le fait pas ou peu. Les chiffres ci-dessous,
            calculés en temps réel, le montrent.
          </p>
        </div>
      </div>

      {/* Section 1: KPIs */}
      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>
          Peu de collectivités publient, encore moins sur les subventions
        </h2>
        <PerspectivesKPICards kpis={kpis} />
      </section>

      {/* Section 2: Comparaison par type de collectivité */}
      <section className='space-y-4'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold'>
            Départements et régions en tête, communes à la traîne
          </h2>
          <p className='max-w-3xl text-muted-foreground'>
            Le niveau de transparence varie fortement selon le type de collectivité. Les
            départements et régions publient davantage, tandis que les communes — qui représentent
            la grande majorité des collectivités — restent très en retard.
          </p>
        </div>
        <ScoreByTypeChart
          mpDistribution={mpDistribution}
          subDistribution={subDistribution}
          year={referenceYear}
        />
      </section>

      {/* Section 3: Score distribution */}
      <section className='space-y-4'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold'>
            Les marchés publics progressent, les subventions restent un angle mort
          </h2>
          <p className='max-w-3xl text-muted-foreground'>
            La transparence sur les marchés publics s&apos;améliore d&apos;année en année, avec de
            plus en plus de collectivités obtenant des scores C ou mieux. En revanche, la
            quasi-totalité des collectivités obtiennent un score E sur les subventions, signe
            d&apos;une publication quasi inexistante.
          </p>
        </div>
        <ScoreDistributionChart mpDistribution={mpDistribution} subDistribution={subDistribution} />
      </section>

      {/* Section 4: Volume evolution */}
      <section className='space-y-4'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold'>
            De plus en plus de données déclarées, de plus en plus de collectivités qui publient
          </h2>
          <p className='max-w-3xl text-muted-foreground'>
            Le nombre de marchés publics déclarés a été multiplié par plus de 10 en quelques années.
            Le nombre de collectivités qui publient leurs données augmente aussi régulièrement,
            signe d&apos;une dynamique positive malgré les lacunes persistantes.
          </p>
        </div>
        <VolumeChart volumes={volumes} />
      </section>

      {/* Section 4: Call to action */}
      <section className='rounded-xl border bg-muted/30 p-6 md:p-8'>
        <h2 className='mb-4 text-2xl font-bold'>Agir pour la transparence</h2>
        <p className='mb-6 max-w-3xl text-muted-foreground'>
          Les communes, qui représentent 96% des collectivités, sont les plus en retard sur la
          publication de leurs données. Les départements et régions font mieux, mais il reste encore
          beaucoup de chemin à parcourir, notamment sur les subventions.
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
      </section>

      {/* Legal context */}
      <section className='space-y-2 text-sm text-muted-foreground'>
        <p>
          Les données présentées sont issues de{' '}
          <Link href='https://data.gouv.fr' className='underline hover:text-foreground'>
            data.gouv.fr
          </Link>{' '}
          et du{' '}
          <Link
            href='https://www.data.gouv.fr/fr/datasets/donnees-essentielles-de-la-commande-publique-fichiers-consolides/'
            className='underline hover:text-foreground'
          >
            fichier consolidé des DECP
          </Link>
          . Le cadre légal est défini par la{' '}
          <Link href='/cadre-reglementaire' className='underline hover:text-foreground'>
            loi pour une République numérique de 2016
          </Link>
          . Pour en savoir plus sur notre méthodologie de notation, consultez la page{' '}
          <Link href='/methodologie' className='underline hover:text-foreground'>
            Méthodologie
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
