import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Quelle transparence sur les dépenses des collectivités ? Perspectives',
  description:
    'La transparence des données publiques aux différents échelons locaux, état des lieux et perspectives',
};

export default function Page() {
  return (
    <main className='mx-auto mb-12 w-full max-w-screen-lg p-6' id='interpeller'>
      <h1 className='text-3xl font-bold'>Etats des lieux et Perspectives</h1>
      <p className='my-6 text-lg'>
        La France est-elle un élève modèle en termes d'ouvertures de ses données publiques aux
        différents échelons locaux ?
      </p>
      <p className='my-6 text-lg'>
        Depuis la loi pour une République numérique de 2016, peut-on constater une amélioration de
        la transparence sur ces données ?
      </p>
      <p className='my-6 text-lg'>
        Quels enseignements tirer de la faible performance de nos collectivités en matière de
        transparence ?
      </p>
      <p className='my-6 text-lg'>
        Attention spoiling : la transparence des données publiques des différentes collectivités
        françaises est mauvaise.
      </p>
      <h2 className='my-12 text-2xl font-bold'>
        La France championne d'Europe et vice championne du monde de l'open data
      </h2>
      <p className='my-6 text-lg'>
        Pour la quatrième année consécutive, la France se classe au premier rang de l'open data en
        Europe selon le{' '}
        <Link
          href='https://data.europa.eu/sites/default/files/odm2024_full_report.pdf?q=sites/default/files/odm2024_full_report_0.pdf'
          className='border-b-2 border-black'
        >
          rapport 2024 sur la maturité des données ouvertes
        </Link>{' '}
        commandé par la commission européenne. Et elle obtient la seconde place au niveau mondial
        dans le dernier{' '}
        <Link
          href='https://www.oecd.org/content/dam/oecd/en/publications/reports/2023/12/2023-oecd-open-useful-and-re-usable-data-ourdata-index_cc9e8a9e/a37f51c3-en.pdf'
          className='border-b-2 border-black'
        >
          OurData Index
        </Link>{' '}
        publié par l’OCDE en 2023.
      </p>
      <p className='my-6 text-lg'>
        Beaucoup de chemin a été parcouru en matière d’ouverture des données publiques. La
        déclaration des droits de l’homme et du citoyen de 1789 érigeait déjà, dans sont article 15,
        la transparence comme un grand principe: « La société a le droit de demander compte à tout
        agent public de son administration ». Il a fallu attendre les lois de 1978 et 1979, à la
        naissance de la CNIL, pour que soit formalisé dans la loi l’accès des citoyens aux archives
        et documents administratifs.
      </p>
      <p className='my-6 text-lg'>
        L’avènement des outils informatiques et de l’internet en particulier a logiquement abouti à
        la loi pour une République numérique de 2016 qui, en théorie, impose à tous les
        établissements publics la publication des données d’intérêt public.{' '}
      </p>
      <p className='my-6 text-lg'>
        <Link href='https://data.gouv.fr' className='border-b-2 border-black'>
          Data.gouv.fr
        </Link>{' '}
        est le navire amiral de la donnée publique. Lancée fin 2011, cette plateforme
        gouvernementale recense et met à disposition toutes les données publiques publiées, en
        théorie. Tous les établissements publiccs sont supposés publier leur données sur cette
        plateforme.
      </p>
      <h2 className='my-12 text-2xl font-bold'>Etat des lieux</h2>
      <p className='my-6 text-lg'>
        En pratique, malgré des rapports très flatteurs sur la transparence des données publiques en
        France, Eclaireur Public met en lumière ce que d'aucuns pressentaient au doigt mouillé, à
        savoir que la transparence sur les dépenses publiques locales reste très limitée.
      </p>
      <p className='my-6 text-lg'>
        Malgré les obligations légales et les initiatives en faveur de l'open data, la majorité des
        collectivités ne publient pas ou peu de données exploitables concernant leurs finances. Les
        données disponibles sont souvent incomplètes, difficiles à trouver ou à réutiliser, et ne
        permettent pas une réelle comparaison entre territoires.
      </p>
      <p className='my-6 text-lg'>
        Ce constat met en évidence un important retard dans la mise en œuvre de la transparence,
        tant sur le plan technique que culturel.
      </p>
      <p className='my-6 text-lg'>
        Sur l'ensemble des collectivités, tous échelons confondus, le score de transparence moyen
        est E, soit une note qui se situe entre 0 et 4 sur 20.
      </p>
      <p>Le verdict est sans appel :</p>
      <ul>
        <li className='list-inside list-disc'>
          90% des régions ont un score de transparence égal à E
        </li>
        <li className='list-inside list-disc'>
          95% des départements ont un score de transparence égal à E
        </li>
        <li className='list-inside list-disc'>
          98% des communes ont un score de transparence égal à E
        </li>
      </ul>
      <p className='my-6 text-lg'>
        Suggestions :<br />
        - cartographie de la transparence des données publiques en Europe, dans le monde
        <br />
        - citation d'une personnalité sur la transparence des données
        <br />
        - Rappel sur les vertus de la transparence et sur les dérives de l'opacité
        <br />
      </p>

      <h2 className='my-12 text-2xl font-bold'>Perspectives</h2>
      <p className='my-6 text-lg'>
        Le diagnostic réalisé grâce à notre initiative citoyenne nous conduit à tirer un ensemble
        d'enseignements et de préconisations dont nous dressons une liste ici :
      </p>
      <ul>
        <li className='list-inside list-disc'>
          D'abord les points positifs :
          <ul className='ml-4'>
            <li className='list-inside list-disc'>
              Au niveau national, il convient de concéder qu'énormément d'efforts ont été réalisés
              dans le bon sens de la transparence des données publiques. Le portail data.gouv.fr,
              créé en 2009, compte aujourd'hui (15 sept 2025) 2,1 millions de jeux de données.
            </li>
            <li className='list-inside list-disc'>Avantage 2</li>
            <li className='list-inside list-disc'>Avantage 3</li>
          </ul>
        </li>
        <li className='mt-4 list-inside list-disc'>
          Puis les points négatifs :
          <ul className='ml-4'>
            <li className='list-inside list-disc'>Désavantage 1</li>
            <li className='list-inside list-disc'>Désavantage 2</li>
            <li className='list-inside list-disc'>Désavantage 3</li>
          </ul>
        </li>
        <li className='mt-4 list-inside list-disc'>
          Les préconisations :
          <ul className='ml-4'>
            <li className='list-inside list-disc'>préconisation 1</li>
            <li className='list-inside list-disc'>préconisation 2</li>
            <li className='list-inside list-disc'>préconisation 3</li>
          </ul>
        </li>
      </ul>
    </main>
  );
}
