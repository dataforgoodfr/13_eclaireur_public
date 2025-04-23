import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Le cadre règlementaire',
  description: 'La loi pour une République Numérique, décryptage par Éclaireur Public',
};
export default function Page() {
  return (
    <main className='mx-auto mb-12 w-full max-w-screen-lg p-6' id='interpeller'>
      <h1 className='text-3xl font-bold'>Le cadre règlementaire</h1>
      <h2 className='my-12 text-xl font-bold'>
        L'open data des collectivités locales : un enjeu de transparence et de démocratie
      </h2>
      Page(
      <p className='my-6 text-lg'>
        Depuis 2016, la loi pour une République numérique a instauré de nouvelles obligations pour
        les collectivités locales en matière d'ouverture des données publiques, aussi appelée "open
        data". Cette démarche vise à rendre accessibles à tous les citoyens les informations
        essentielles concernant l'action des pouvoirs publics.
      </p>
      <h2 className='my-12 text-xl font-bold'>Quelles collectivités sont concernées ?</h2>
      <p className='my-6 text-lg'>
        Les organisations qui emploient plus de cinquante personnes en équivalents temps plein, à
        l’exclusion des collectivités territoriales de moins de 3 500 habitants ont l'obligation de
        publier en ligne leurs données publiques.
      </p>
      <h2 className='my-12 text-xl font-bold'>Quelles données doivent être publiées ?</h2>
      <p className='my-6 text-lg'>Les collectivités doivent mettre en ligne :</p>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>
          Les documents qu'elles communiquent suite à des demandes d'accès
        </li>
        <li className='my-6 text-lg'>
          Les principales bases de données qu'elles produisent ou reçoivent
        </li>
        <li className='my-6 text-lg'>
          Les données dont la publication présente un intérêt économique, social ou environnemental
        </li>
      </ul>
      <p className='my-6 text-lg'>
        Par exemple : budgets, subventions, marchés publics, délibérations du conseil municipal,
        etc.
      </p>
      <p className='my-6 text-lg'>
        À noter que certaines informations ne peuvent pas être publiées en open data (notamment les
        données personnelles, les documents couverts par des secrets protégés par la loi, les
        documents soumis à des droits d'auteur...).
      </p>
      <p className='my-6 text-lg'>
        La loi ne fixe pas de liste nominative des données à publier ou des sujets concernés. Bien
        que des décrets spécifiques précisent cette obligation dans des cadres spécifiques (marchés
        publics, subventions...), d'autres sujets concernant les collectivités peuvent être soumis à
        cette obligation de transparence sans être spécifiquement désignés par la loi.
      </p>
      <h2 className='my-12 text-xl font-bold'>Quels sont les bénéfices pour les citoyens ?</h2>
      <p className='my-6 text-lg'>L'open data a plusieurs objectifs :</p>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>Une meilleure transparence de l'action publique</li>
        <li className='my-6 text-lg'>
          Une possibilité de réexploitation des données pour différents usages, notamment
          scientifiques et citoyens
        </li>
        <li className='my-6 text-lg'>
          Un regard et une participation citoyens accrus aux décisions locales
        </li>
      </ul>
      <h2 className='my-12 text-xl font-bold'>Comment les données sont-elles publiées ?</h2>
      <p className='my-6 text-lg'>
        Les données doivent être publiées dans un format ouvert, facilement réutilisable par des
        machines. Elles doivent être régulièrement mises à jour.
        <br />
        Des recommandation de schémas de données sont émises par{' '}
        <Link href='https://schema.data.gouv.fr/' className='border-b-2 border-black'>
          data.gouv.fr
        </Link>{' '}
        dans le but d’augmenter la qualité des données publiées.
      </p>
      <h2 className='my-12 text-xl font-bold'>
        Et si ma collectivité ne respecte pas ces obligations ?
      </h2>
      <p className='my-6 text-lg'>
        Vous pouvez contacter votre collectivité pour l'inciter à publier ses données. En cas de
        refus, il est possible de saisir la{' '}
        <Link href='https://www.cada.fr/' className='border-b-2 border-black'>
          Commission d'accès aux documents administratifs (CADA)
        </Link>
        .<br />
        Des associations peuvent vous aider à demander ces documents publics, à l’instar de{' '}
        <Link href='https://madada.fr/' className='border-b-2 border-black'>
          Ma Dada
        </Link>
        .
      </p>
      <p className='my-6 text-lg'>
        Notre plateforme vise justement à cartographier les pratiques des collectivités et à les
        accompagner dans cette démarche d'ouverture. N'hésitez pas à consulter nos données pour voir
        où en est votre collectivité !
      </p>
      <h2 className='my-12 text-xl font-bold'>Aller plus loin</h2>
      <h3 className='my-6 text-lg font-bold'>Cadre légal général</h3>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>
          La{' '}
          <Link
            href='https://www.legifrance.gouv.fr/dossierlegislatif/JORFDOLE000031589829/'
            className='border-b-2 border-black'
          >
            Loi pour une République Numérique
          </Link>{' '}
          d’octobre 2016 établit le cadre général de l'ouverture des données publiques en France
        </li>
        <li className='my-6 text-lg'>
          L’article{' '}
          <Link
            href='https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033205512'
            className='border-b-2 border-black'
          >
            L312-1-1 du Code des relations entre le public et l'administration
          </Link>{' '}
          résultant de la Loi pour une République Numérique, en vigueur depuis le 9 octobre 2016,
          détaille les obligations de publication en ligne des documents administratifs
        </li>
      </ul>
      <p className='my-6 text-lg'>
        La loi prévoit des dispositions spécifiques pour les subventions, les marchés publics ou les
        contrats de concession (ci-après). Les administrations ont néanmoins l'obligation de publier
        les données répondant aux exigences du cadre général sur tous thèmes concernés; la loi ne
        fixe pas de liste nominative ou exhaustive des données entrant dans son périmètre.
      </p>
      <h3 className='my-6 text-lg font-bold'>Dispositions spécifiques aux subventions</h3>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>
          L’
          <Link
            href='https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000045213404'
            className='border-b-2 border-black'
          >
            article 10 de la loi n° 2000-321
          </Link>{' '}
          du 12 avril 2000 pose le principe de transparence des subventions publiques
        </li>
        <li className='my-6 text-lg'>
          Le{' '}
          <Link
            href='https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000034600552'
            className='border-b-2 border-black'
          >
            décret n° 2017-779
          </Link>{' '}
          du 5 mai 2017 précise les données essentielles des subventions qui doivent être rendues
          publiques
        </li>
        <li className='my-6 text-lg'>
          L’
          <Link
            href='https://www.legifrance.gouv.fr/loda/id/JORFTEXT000036040528'
            className='border-b-2 border-black'
          >
            arrêté du 17 novembre 2017
          </Link>
          , en vigueur au 27 février 2025, précise les conditions techniques de mise en ligne des
          données relatives aux subventions.
        </li>
      </ul>
      <h3 className='my-6 text-lg font-bold'>Dispositions spécifiques à la commande publique</h3>
      <p className='my-6 text-lg'>
        La création du Code de la commande publique en 2019 a non seulement changé la nomenclature
        légale, mais aussi certaines modalités d'application. Le cadre légal détaillé ci-après sera
        découpé en deux périodes: depuis 2019, puis de 2016 à 2019.
      </p>
      <h4 className='my-6 text-base font-bold'>Cadre légal en vigueur (depuis 2019)</h4>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>
          <Link
            href='https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037703867'
            className='border-b-2 border-black'
          >
            Article L.2196-2
          </Link>{' '}
          : Cet article impose aux acheteurs publics de rendre accessibles, sous un format ouvert et
          librement réutilisable, les données essentielles des marchés publics, sauf si leur
          divulgation contrevient à l’ordre public ou aux secrets protégés par la loi.
        </li>
        <li className='my-6 text-lg'>
          <Link
            href='https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037705011'
            className='border-b-2 border-black'
          >
            Article L.3131-1
          </Link>{' '}
          : Il étend cette obligation aux contrats de concession, avec les mêmes conditions de
          transparence et d’accessibilité que pour les marchés publics.
        </li>
        <li className='my-6 text-lg'>
          <Link
            href='https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000037701019/LEGISCTA000037725175/#LEGISCTA000037729527'
            className='border-b-2 border-black'
          >
            Article R.2196-1
          </Link>{' '}
          : Précise que les données essentielles doivent être publiées sur le profil d’acheteur
          (plateforme électronique dédiée) et fixe leur caractère “libre, direct et complet”. Pour
          les marchés entre 25 000 € HT et 40 000 € HT, l’acheteur peut publier annuellement une
          liste simplifiée des marchés conclus.
        </li>
        <li className='my-6 text-lg'>
          <Link
            href='https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045739624'
            className='border-b-2 border-black'
          >
            Article R.3131-1
          </Link>{' '}
          : Définit les modalités spécifiques pour la publication des données essentielles des
          contrats de concession, similaires à celles des marchés publics.
        </li>
        <li className='my-6 text-lg'>
          <Link
            href='https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000038318675'
            className='border-b-2 border-black'
          >
            Arrêté du 22 mars 2019
          </Link>{' '}
          : Liste les données essentielles à publier (montant, durée, titulaire, etc.) et fixe les
          formats, normes et nomenclatures pour leur mise en ligne.
        </li>
        <li className='my-6 text-lg'>
          <Link
            href='https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000045733739'
            className='border-b-2 border-black'
          >
            Décret n° 2022-767 du 2 mai 2022
          </Link>{' '}
          : Imposant depuis le 1er janvier 2024 que toutes les données essentielles soient publiées
          sur une plateforme unique nationale, data.gouv.fr, afin de centraliser et standardiser
          leur accessibilité.
        </li>
      </ul>
      <p className='my-6 text-lg'>
        A compter du 1er Janvier 2024, les données essentielles des marchés publics et des contrats
        de concession doivent être publiées par les acheteurs et les autorités concédantes
        directement sur data.gouv.fr
      </p>
      <h4 className='my-6 text-base font-bold'>
        Cadre légal antérieur au Code de la commande publique (jusqu'en 2019)
      </h4>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>
          L’
          <Link
            href='https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000034416864/2024-04-01'
            className='border-b-2 border-black'
          >
            article 107 du décret n° 2016-360
          </Link>{' '}
          du 25 mars 2016 précise les modalités de publication des données essentielles des marchés
          publics
        </li>
        <li className='my-6 text-lg'>
          L’
          <Link
            href='https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000034417149/2017-04-13'
            className='border-b-2 border-black'
          >
            article 94 du décret n° 2016-361
          </Link>{' '}
          du 25 mars 2016 définit les règles de publication des données essentielles pour les
          marchés de défense et de sécurité
        </li>
        <li className='my-6 text-lg'>
          L’
          <Link
            href='https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000031965295/2016-04-01'
            className='border-b-2 border-black'
          >
            article 34 du décret n° 2016-86
          </Link>{' '}
          du 1er février 2016 détaille les obligations de publication des données essentielles des
          contrats de concession
        </li>
        <li className='my-6 text-lg'>
          L’
          <Link
            href='https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037282956/'
            className='border-b-2 border-black'
          >
            arrêté du 27 juillet 2018
          </Link>
          , modifiant les dispositions précédentes sur les les exigences techniques minimales pour
          les outils de communication électronique dans le cadre des marchés publics
        </li>
      </ul>
      <h4 className='my-6 text-base font-bold'>Synthèse des évolutions du cadre légal</h4>
      <table className='table-fixed border-collapse border-spacing-2 border border-gray-400'>
        <caption>évolutions du cadre légal</caption>
        <thead>
          <tr>
            <th className='border border-gray-300 p-4'>Sujet</th>
            <th className='border border-gray-300 p-4'>Depuis 2019</th>
            <th className='border border-gray-300 p-4'>Avant 2019</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='border border-gray-300 p-4'>
              Seuil de publication d'un marché public (la commande peut se faire de gré-à-gré
              en-déçà)
            </td>
            <td className='border border-gray-300 p-4'>40 000 €HT</td>
            <td className='border border-gray-300 p-4'>25 000 €HT</td>
          </tr>
          <tr>
            <td className='border border-gray-300 p-4'>
              Obligation de publication de données en Open Data
            </td>
            <td className='border border-gray-300 p-4'>
              Marchés publics &gt; 40 000 €HT
              <br />
              Information sans obligation de détail pour les marchés de 25 à 40 000 € HT
            </td>
            <td className='border border-gray-300 p-4'>Marchés publics &gt; 25 000 €HT</td>
          </tr>
          <tr>
            <td className='border border-gray-300 p-4'>Contrats de concession</td>
            <td className='border border-gray-300 p-4'>
              Assimilés à des marchés publics: règles identiques (mais sans condition de seuil)
            </td>
            <td className='border border-gray-300 p-4'>Règles spécifiques</td>
          </tr>
          <tr>
            <td className='border border-gray-300 p-4'>Digitalisation de la commande publique</td>
            <td className='border border-gray-300 p-4'>
              Obligation de l'utilisation d'une plateforme numérique pour la publication des appels
              d'offres
            </td>
            <td className='border border-gray-300 p-4'>Néant</td>
          </tr>
          <tr>
            <td className='border border-gray-300 p-4'>
              Publication obligatoire des données sur la plateforme nationale
            </td>
            <td className='border border-gray-300 p-4'>
              Uniquement depuis 2024: publication sur data.gouv.fr
            </td>
            <td className='border border-gray-300 p-4'>Néant (aucune obligation de plateforme)</td>
          </tr>
        </tbody>
      </table>
      <h4 className='my-6 text-base font-bold'>
        Les guides officiels publiés pour aider les collectivités
      </h4>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>
          <Link
            href='https://www.cnil.fr/sites/cnil/files/atoms/files/guide_open_data.pdf'
            className='border-b-2 border-black'
          >
            Le guide de l’open data
          </Link>
          , CNIL & CADA, 2019
        </li>
        <li className='my-6 text-lg'>
          <Link
            href='https://guides.data.gouv.fr/guides-open-data/guide-juridique/producteurs-de-donnees'
            className='border-b-2 border-black'
          >
            Le guide juridique de l’open data
          </Link>
          , datagouv.fr
        </li>
      </ul>
      <h4 className='my-6 text-base font-bold'>Les principaux sites de publications nationaux</h4>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>
          <Link href='http://data.gouv.fr/' className='border-b-2 border-black'>
            data.gouv.fr
          </Link>
        </li>
        <li className='my-6 text-lg'>
          <Link href='http://schema.data.gouv.fr/' className='border-b-2 border-black'>
            schema.data.gouv.fr
          </Link>
        </li>
      </ul>
      <p className='my-6 text-lg'>
        La loi pour une République numérique de 2016 a instauré de nouvelles obligations pour les
        collectivités locales en matière d'ouverture des données publiques, aussi appelée "open
        data". Cette démarche vise à rendre accessibles à tous les citoyens les informations
        détenues par les administrations.
      </p>
    </main>
  );
}
