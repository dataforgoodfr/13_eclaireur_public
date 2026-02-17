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

export default async function Page() {
  const [kpis, mpDistribution, subDistribution, volumes] = await Promise.all([
    fetchPerspectivesKPIs(),
    fetchMpScoreDistribution(),
    fetchSubScoreDistribution(),
    fetchYearlyVolumes(),
  ]);

  return (
    <main className='mx-auto mb-12 w-full max-w-screen-xl space-y-12 p-6'>
      {/* Header */}
      <div className='space-y-4'>
        <h1 className='text-3xl font-bold md:text-4xl'>État des lieux et Perspectives</h1>
        <p className='max-w-3xl text-lg text-muted-foreground'>
          Depuis la loi pour une République numérique de 2016, les collectivités territoriales
          doivent publier leurs données de dépenses publiques en open data. Où en est-on
          concrètement ? Les chiffres ci-dessous sont calculés en temps réel à partir de notre base
          de données.
        </p>
      </div>

      {/* Section 1: KPIs */}
      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>Le constat en un coup d&apos;œil</h2>
        <PerspectivesKPICards kpis={kpis} />
      </section>

      {/* Section 2: Comparaison par type de collectivité */}
      <section className='space-y-4'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold'>Qui sont les bons et les mauvais élèves ?</h2>
          <p className='max-w-3xl text-muted-foreground'>
            Le niveau de transparence varie fortement selon le type de collectivité. Les
            départements et régions publient davantage, tandis que les communes — qui représentent
            la grande majorité des collectivités — restent très en retard.
          </p>
        </div>
        <ScoreByTypeChart
          mpDistribution={mpDistribution}
          subDistribution={subDistribution}
          year={2024}
        />
      </section>

      {/* Encart : La France bien classée */}
      <section className='rounded-xl border border-blue-200 bg-blue-50/50 p-6 md:p-8'>
        <h2 className='mb-3 text-xl font-bold'>
          La France, championne d&apos;Europe de l&apos;open data
        </h2>
        <p className='mb-3 text-muted-foreground'>
          Pour la quatrième année consécutive, la France se classe au premier rang de l&apos;open
          data en Europe selon le{' '}
          <Link
            href='https://data.europa.eu/sites/default/files/odm2024_full_report.pdf'
            className='underline hover:text-foreground'
            target='_blank'
          >
            rapport 2024 sur la maturité des données ouvertes
          </Link>{' '}
          de la Commission européenne, et obtient la seconde place au niveau mondial dans le{' '}
          <Link
            href='https://www.oecd.org/content/dam/oecd/en/publications/reports/2023/12/2023-oecd-open-useful-and-re-usable-data-ourdata-index_cc9e8a9e/a37f51c3-en.pdf'
            className='underline hover:text-foreground'
            target='_blank'
          >
            OurData Index
          </Link>{' '}
          de l&apos;OCDE.
        </p>
        <p className='text-sm text-muted-foreground'>
          Pourtant, ce classement reflète surtout l&apos;ambition de l&apos;État central. Au niveau
          local, la réalité est bien différente : la majorité des collectivités ne publient pas ou
          peu de données exploitables sur leurs dépenses.
        </p>
      </section>

      {/* Section 2: Score distribution */}
      <section className='space-y-4'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold'>Marchés publics vs Subventions : deux vitesses</h2>
          <p className='max-w-3xl text-muted-foreground'>
            La transparence sur les marchés publics progresse, avec de plus en plus de collectivités
            obtenant des scores C ou mieux. En revanche, les subventions restent un angle mort : la
            quasi-totalité des collectivités obtiennent un score E, signe d&apos;une publication
            quasi inexistante.
          </p>
        </div>
        <ScoreDistributionChart mpDistribution={mpDistribution} subDistribution={subDistribution} />
      </section>

      {/* Section 3: Volume evolution */}
      <section className='space-y-4'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold'>Le volume de données déclarées explose</h2>
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
