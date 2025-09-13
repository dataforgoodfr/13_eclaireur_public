import type { Metadata } from 'next';
import Link from 'next/link';

import Card from '#app/components/SectionCard';
import { SectionHeader } from '#app/components/SectionHeader';

export const metadata: Metadata = {
  title: 'Le cadre règlementaire',
  description: 'La loi pour une République Numérique, décryptage par Éclaireur Public',
};

export default function Page() {
  return (
    <main
      className='mx-auto mb-12 flex w-full flex-col items-center justify-center'
      id='cadre-reglementaire'
    >
      <SectionHeader sectionTitle='Le cadre règlementaire' />
      {/* Main div */}
      <div className='flex-col items-center justify-center p-6 md:max-w-screen-lg' id='main-div'>
        {/* Open data */}
        <Card title="L'open data des collectivités locales : un enjeu de transparence et de démocratie">
          <p>
            Depuis 2016, la loi pour une République numérique a instauré de nouvelles obligations
            pour les collectivités locales en matière d'ouverture des données publiques, aussi
            appelée "open data". Cette démarche vise à rendre accessibles à tous les citoyens les
            informations essentielles concernant l'action des pouvoirs publics.
          </p>
          <h2>Quelles collectivités sont concernées ?</h2>
          <p>
            Les organisations qui emploient plus de cinquante personnes en équivalent temps plein, à
            l’exclusion des collectivités territoriales de moins de 3 500 habitants ont l'obligation
            de publier en ligne leurs données publiques.
          </p>
          <h2>Quelles données doivent être publiées ?</h2>
          Les collectivités doivent mettre en ligne :
          <ul className='list-disc space-y-1 pl-5'>
            <li>Les documents qu'elles communiquent suite à des demandes d'accès</li>
            <li>Les principales bases de données qu'elles produisent ou reçoivent</li>
            <li>
              Les données dont la publication présente un intérêt économique, social ou
              environnemental
            </li>
          </ul>
          <p>
            Par exemple : budgets, subventions, marchés publics, délibérations du conseil municipal,
            etc.
          </p>
          <p>
            À noter que certaines informations ne peuvent pas être publiées en open data (notamment
            les données personnelles, les documents couverts par des secrets protégés par la loi,
            les documents soumis à des droits d'auteur...). Dans ces cas, il est possible que les
            documents soient publiés mais anonymisés.
          </p>
          <p>
            La loi ne fixe pas de liste nominative des données à publier ou des sujets concernés.
            Bien que des décrets spécifiques précisent cette obligation dans des cadres spécifiques
            (marchés publics, subventions...), d'autres sujets concernant les collectivités peuvent
            être soumis à cette obligation de transparence sans être spécifiquement désignés par la
            loi.
          </p>
          <h2>Quels sont les bénéfices pour les citoyens ?</h2>
          L'open data a plusieurs objectifs :
          <ul className='list-disc space-y-1 pl-5'>
            <li>Une meilleure transparence de l'action publique</li>
            <li>
              Une possibilité de réexploitation des données pour différents usages, notamment
              scientifiques et citoyens
            </li>
            <li>Un regard et une participation citoyens accrus aux décisions locales</li>
          </ul>
          <h2>Comment les données sont-elles publiées ?</h2>
          <p>
            Les données doivent être publiées dans un format ouvert, facilement réutilisable par des
            machines. Elles doivent être régulièrement mises à jour. Des recommandation de schémas
            de données sont émises par data.gouv.fr dans le but d’augmenter la qualité des données
            publiées.
          </p>
          <h2>Et si ma collectivité ne respecte pas ces obligations ?</h2>
          <p>
            Vous pouvez contacter votre collectivité pour l'inciter à publier ses données. En cas de
            refus, il est possible de saisir la{' '}
            <Link href='https://www.cada.fr/' className='underline'>
              Commission d'accès aux documents administratifs (CADA)
            </Link>
            . Des associations peuvent vous aider à demander ces documents publics, à l’instar de{' '}
            <Link href='https://madada.fr/' className='underline'>
              Ma Dada
            </Link>
            . Notre plateforme vise justement à cartographier les pratiques des collectivités et à
            les accompagner dans cette démarche d'ouverture. N'hésitez pas à consulter nos données
            pour voir où en est votre collectivité !
          </p>
        </Card>

        <Card title='Aller plus loin'>
          <h3>Cadre légal général</h3>
          <ul className='list-disc space-y-1 pl-5'>
            <li>
              La{' '}
              <Link
                href='https://www.legifrance.gouv.fr/dossierlegislatif/JORFDOLE000031589829/'
                className='underline'
              >
                Loi pour une République Numérique
              </Link>{' '}
              d’octobre 2016 établit le cadre général de l'ouverture des données publiques en France
            </li>
            <li>
              L'
              <Link
                href='https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033205512'
                className='underline'
              >
                L312-1-1 du Code des relations entre le public et l'administration
              </Link>
              résultant de la Loi pour une République Numérique, en vigueur depuis le 9 octobre
              2016, détaille les obligations de publication en ligne des documents administratifs
            </li>
          </ul>
          <p>
            La loi prévoit des dispositions spécifiques pour les subventions, les marchés publics ou
            les contrats de concession (ci-après). Les administrations ont néanmoins l'obligation de
            publier les données répondant aux exigences du cadre général sur tous thèmes concernés;
            la loi ne fixe pas de liste nominative ou exhaustive des données entrant dans son
            périmètre.
          </p>
          <h3>Dispositions spécifiques aux subventions</h3>
          <ul className='list-disc space-y-1 pl-5'>
            <li>
              L’
              <Link
                href='https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000045213404'
                className='underline'
              >
                article 10 de la loi n° 2000-321
              </Link>{' '}
              du 12 avril 2000 pose le principe de transparence des subventions publiques
            </li>
            <li>
              Le{' '}
              <Link
                href='https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000034600552'
                className='underline'
              >
                décret n° 2017-779
              </Link>{' '}
              du 5 mai 2017 précise les données essentielles des subventions qui doivent être
              rendues publiques{' '}
            </li>
            <li>
              L’
              <Link
                href='https://www.legifrance.gouv.fr/loda/id/JORFTEXT000036040528'
                className='underline'
              >
                arrêté du 17 novembre 2017
              </Link>
              , en vigueur au 27 février 2025, précise les conditions techniques de mise en ligne
              des données relatives aux subventions.
            </li>
          </ul>
          <h3>Dispositions spécifiques à la commande publique</h3>
          <p>
            La création du Code de la commande publique en 2019 a non seulement changé la
            nomenclature légale, mais aussi certaines modalités d'application. Le cadre légal
            détaillé ci-après sera découpé en deux périodes: depuis 2019, puis de 2016 à 2019.
          </p>
          <h4>Cadre légal en vigueur (depuis 2019)</h4>
          <ul className='list-disc space-y-1 pl-5'>
            <li>
              <Link
                href='https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037703867'
                className='underline'
              >
                Article L.2196-2
              </Link>{' '}
              : Cet article impose aux acheteurs publics de rendre accessibles, sous un format
              ouvert et librement réutilisable, les données essentielles des marchés publics, sauf
              si leur divulgation contrevient à l’ordre public ou aux secrets protégés par la loi.
            </li>
            <li>
              <Link
                href='https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037705011'
                className='underline'
              >
                Article L.3131-1
              </Link>{' '}
              : Il étend cette obligation aux contrats de concession, avec les mêmes conditions de
              transparence et d’accessibilité que pour les marchés publics.
            </li>
            <li>
              <Link
                href='https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000037701019/LEGISCTA000037725175/#LEGISCTA000037729527'
                className='underline'
              >
                Article R.2196-1
              </Link>{' '}
              : Précise que les données essentielles doivent être publiées sur le profil d’acheteur
              (plateforme électronique dédiée) et fixe leur caractère “libre, direct et complet”.
              Pour les marchés entre 25 000 € HT et 40 000 € HT, l’acheteur peut publier
              annuellement une liste simplifiée des marchés conclus.
            </li>
            <li>
              <Link
                href='https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045739624'
                className='underline'
              >
                Article R.3131-1
              </Link>{' '}
              : Définit les modalités spécifiques pour la publication des données essentielles des
              contrats de concession, similaires à celles des marchés publics.
            </li>
            <li>
              <Link
                href='https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000038318675'
                className='underline'
              >
                Arrêté du 22 mars 2019
              </Link>{' '}
              : Liste les données essentielles à publier (montant, durée, titulaire, etc.) et fixe
              les formats, normes et nomenclatures pour leur mise en ligne.
            </li>
            <li>
              <Link
                href='https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000045733739'
                className='underline'
              >
                Décret n° 2022-767 du 2 mai 2022
              </Link>{' '}
              : Imposant depuis le 1er janvier 2024 que toutes les données essentielles soient
              publiées sur une plateforme unique nationale, data.gouv.fr, afin de centraliser et
              standardiser leur accessibilité.
            </li>
          </ul>
          <p>
            A compter du 1er Janvier 2024, les données essentielles des marchés publics et des
            contrats de concession doivent être publiées par les acheteurs et les autorités
            concédantes directement sur data.gouv.fr
          </p>
          <h4>Cadre légal antérieur au Code de la commande publique (jusqu'en 2019)</h4>
          <ul className='list-disc space-y-1 pl-5'>
            <li>
              L’
              <Link
                href='https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000034416864/2024-04-01'
                className='underline'
              >
                article 107 du décret n° 2016-360
              </Link>{' '}
              du 25 mars 2016 précise les modalités de publication des données essentielles des
              marchés publics
            </li>
            <li>
              L’
              <Link
                href='https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000034417149/2017-04-13'
                className='underline'
              >
                article 94 du décret n° 2016-361
              </Link>{' '}
              du 25 mars 2016 définit les règles de publication des données essentielles pour les
              marchés de défense et de sécurité
            </li>
            <li>
              L’
              <Link
                href='https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000031965295/2016-04-01'
                className='underline'
              >
                article 34 du décret n° 2016-86
              </Link>{' '}
              du 1er février 2016 détaille les obligations de publication des données essentielles
              des contrats de concession
            </li>
            <li>
              L’
              <Link
                href='https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037282956/'
                className='underline'
              >
                arrêté du 27 juillet 2018
              </Link>
              , modifiant les dispositions précédentes sur les les exigences techniques minimales
              pour les outils de communication électronique dans le cadre des marchés publics
            </li>
          </ul>
          <h3>Synthèse des évolutions du cadre légal</h3>
          <table className=''>
            <caption className='mb-2 text-left font-bold'>Évolutions du cadre légal</caption>
            <thead className='text-left text-base font-medium text-muted'>
              <tr className=''>
                <th className=''>Sujet</th>
                <th className=''>Depuis 2019</th>
                <th className=''>Avant 2019</th>
              </tr>
            </thead>
            <tbody className='text-lg leading-6'>
              <tr className='border-y-2 p-2'>
                <td className='py-4'>
                  Seuil de publication d'un marché public (la commande peut se faire de gré-à-gré
                  en-déçà)
                </td>
                <td className='py-4'>40 000 €HT</td>
                <td className='py-4'>25 000 €HT</td>
              </tr>
              <tr className='border-y-2'>
                <td className='py-4'>Obligation de publication de données en Open Data</td>
                <td className='py-4'>
                  Marchés publics &gt; 40 000 €HT
                  <br />
                  Information sans obligation de détail pour les marchés de 25 à 40 000 € HT
                </td>
                <td className='py-4'>Marchés publics &gt; 25 000 €HT</td>
              </tr>
              <tr className='border-y-2'>
                <td className='py-4'>Contrats de concession</td>
                <td className='py-4'>
                  Assimilés à des marchés publics: règles identiques (mais sans condition de seuil)
                </td>
                <td className='py-4'>Règles spécifiques</td>
              </tr>
              <tr className='border-y-2'>
                <td className='py-4'>Digitalisation de la commande publique</td>
                <td className='py-4'>
                  Obligation de l'utilisation d'une plateforme numérique pour la publication des
                  appels d'offres
                </td>
                <td className='py-4'>Néant</td>
              </tr>
              <tr className='border-t-2'>
                <td className='py-4'>
                  Publication obligatoire des données sur la plateforme nationale
                </td>
                <td className='py-4'>Uniquement depuis 2024: publication sur data.gouv.fr</td>
                <td className='py-4'>Néant (aucune obligation de plateforme)</td>
              </tr>
            </tbody>
          </table>

          <h3>Les guides officiels publiés pour aider les collectivités</h3>
          <ul className='list-inside list-disc'>
            <li>
              <Link
                href='https://www.cnil.fr/sites/cnil/files/atoms/files/guide_open_data.pdf'
                className='underline'
              >
                Le guide de l’open data
              </Link>
              , CNIL & CADA, 2019
            </li>
            <li>
              <Link
                href='https://guides.data.gouv.fr/guides-open-data/guide-juridique/producteurs-de-donnees'
                className='underline'
              >
                Le guide juridique de l’open data
              </Link>
              , datagouv.fr
            </li>
          </ul>
          <h3>Les principaux sites de publications nationaux</h3>
          <ul className='list-inside list-disc'>
            <li>
              <Link href='http://data.gouv.fr/' className='underline'>
                data.gouv.fr
              </Link>
            </li>
            <li>
              <Link href='http://schema.data.gouv.fr/' className='underline'>
                schema.data.gouv.fr
              </Link>
            </li>
          </ul>
          <p>
            La loi pour une République numérique de 2016 a instauré de nouvelles obligations pour
            les collectivités locales en matière d'ouverture des données publiques, aussi appelée
            "open data". Cette démarche vise à rendre accessibles à tous les citoyens les
            informations détenues par les administrations.
          </p>
        </Card>
      </div>
    </main>
  );
}
