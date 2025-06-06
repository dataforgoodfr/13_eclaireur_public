import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "La méthodologie ou les dessous de l'outil Éclaireur Public",
  description:
    'Comment réunir savoir-faire, technologies dernier cri et bonnes volontés pour la transparence des données publiques, revue de détails',
};

export default function Page() {
  return (
    <main className='mx-auto mb-12 w-full max-w-screen-lg p-6' id='interpeller'>
      <h1 className='text-3xl font-bold'>
        La méthodologie ou les dessous de l'outil Éclaireur Public
      </h1>
      <h2 className='my-12 text-xl font-bold'>
        Comment réunir savoir-faire, technologies dernier cri et bonnes volontés pour la
        transparence des données publiques, revue de détails
      </h2>
      <p className='my-6 text-lg'>
        Eclaireur Public a vocation à éclairer les citoyens sur les données publiques, et
        particulièrement sur les subventions et marchés publics des différentes strates composant
        les collectivités territoriales, à savoir communes, intercommunalités,
        agglomérations/métropoles, départements et régions.
      </p>
      <p className='my-6 text-lg'>
        Pour parvenir à ces fins, Transparency International France et Anticor ont rédigé de concert
        un document préparatoire intitulé « Eclaireur Public – Analyse de la transparence des
        collectivités locales » définissant les objectifs généraux et un cadre qui donne corps à l
        ‘objet « Eclaireur Public », site internet « permett[ant] aux visiteurs de consulter des
        données à jour sur sa collectivité locale ». Avec comme objectif sous-jacent,
        l’accompagnement des acteurs de ces collectivités et l’incitation à améliorer la
        transparence de ces structures.
      </p>
      <p className='my-6 text-lg'>
        Un pré-travail de défrichage des données (via un pipeline de scraping automatisé) avait été
        mis en place grâce à un script en langage Python pour récupérer les données spécifiquement
        sur data.gouv.fr. L’algorithme est disponible en open source à l’adresse suivante :<br />
        <Link href='https://github.com/m4xim1nus/LocalOuvert' className='border-b-2 border-black'>
          https://github.com/m4xim1nus/LocalOuvert
        </Link>
      </p>
      <p className='my-6 text-lg'>
        Décision est prise fin 2024 par TIF et Anticor de faire appel au réseau de bénévolat Data
        For Good le bien nommé pour répondre aux attentes d’un projet d’ouverture des données
        d’envergure au service du bien public.
      </p>
      <p className='my-6 text-lg'>
        Fin février, le projet, parmi 11 autres, est présenté aux bénévoles sur la chaîne{' '}
        <Link
          href='https://www.youtube.com/watch?v=pwBhVAz8_uY'
          className='border-b-2 border-black'
        >
          YouTube de Data For Good
        </Link>
        .
      </p>
      <h2 className='my-12 text-2xl font-bold'>La collecte des données</h2>
      <p className='my-6 text-lg'>
        En théorie, les données sur les subventions et les marchés publics sont toutes disponibles
        en « open data » sur le site dédié aux données censées être publiques data.gouv.fr.
      </p>
      <p className='my-6 text-lg'>
        En réalité, les données sont disséminées en de multiples endroits que seul-e-s des
        professionnels de la donnée numérique, des data engineers aux data analysts jusqu’aux data
        scientists, sans compter quelques nerds psychopathes des données de tout poil, sont capables
        de les exhumer.
      </p>
      <p className='my-6 text-lg'>
        À l’initialisation du projet (en avril 2025), 31 jeux de données ont été nécessaires pour
        mettre en place cet outil, Eclaireur Public, dont voici les principaux :
      </p>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>OFGL Régions</li>
        <li className='my-6 text-lg'>OFGL Départements</li>
        <li className='my-6 text-lg'>OFGL Communes</li>
        <li className='my-6 text-lg'>OFGL Intercommunalités</li>
        <li className='my-6 text-lg'>OFGL Départements</li>
      </ul>
      <h2 className='my-12 text-xl font-bold'>
        L’élaboration d’un indice de transparence des collectivités
      </h2>
      <p className='my-6 text-lg'>
        Il est apparu évident, et nécessaire, dès le début que pour comparer les collectivités entre
        elles et pour mesurer leur degré d’ouverture des données publiques, il fallait construire un
        indice qui repose sur un certain nombre de critères objectifs. <br />
        Le groupe de travail « barème de transparence », en étroite collaboration avec TIF et
        Anticor a finalement élaboré 3 indices de transparence, calqué sur une notation allant de A
        à E (comme le nutriscore) :
      </p>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>l’indice de transparence des subventions</li>
        <li className='my-6 text-lg'>l’indice de transparence des marchés publics</li>
        <li className='my-6 text-lg'>l’indice de transparence agrégé des 2 indices précédents</li>
      </ul>
      <h3 className='my-6 text-lg font-bold'>Calcul de l’indice de transparence des subventions</h3>
      <p className='my-6 text-lg'>
        Pour une année N, l’indice de transparence des subventions d’une collectivité se calcule
        comme suit : Somme des subventions détaillées divisée par somme totale des subventions
        indiquée dans le budget du compte administratif.
        <br />
        La grille ci-dessous établit les notes de transparence, de A à E, en fonction du taux de
        publication, la valeur A étant la note maximale avec un taux de publication de 100 %, et la
        valeur E la note la plus basse avec un taux de publication inférieur à 40 % de publications
        ou pour le cas où les données sont inexploitables.
      </p>
      <p>
        <Image src='index-subventions.png' width={810} height={116} alt='' />
      </p>

      <h3 className='my-6 text-lg font-bold'>
        Calcul de l’indice de transparence des marchés publics
      </h3>
      <p className='my-6 text-lg'>
        L'indice de transparence des marchés publics est établi selon la conjonction de 3 facteurs
        principaux :
      </p>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>
          la publication de données sur les marchés inférieurs à 40000 €
        </li>
        <li className='my-6 text-lg'>
          la publication de données sur les marchés supérieurs à 40000 €
        </li>
        <li className='my-6 text-lg'>
          la publication de données sur les 13 critères suivants :
          <ul className='list-inside list-disc pl-16'>
            <li>identifiant marché</li>
            <li>code CPV</li>
            <li>montant</li>
            <li>date de notification</li>
            <li>lieu exécution code type de code</li>
            <li>lieu exécution code</li>
            <li>lieu d'exécution nom</li>
            <li>forme de prix</li>
            <li>objet</li>
            <li>nature</li>
            <li>durée en mois</li>
            <li>procédure</li>
            <li>titulaire</li>
          </ul>
        </li>
      </ul>
      <p className='my-6 text-lg'>
        La grille ci-dessous établit les notes de A à E. Plus la collectivité remplit les critères,
        meilleure est sa note.
      </p>
      <p>
        <Image src='index-mp.png' width={811} height={237} alt='' />
      </p>
      <h3 className='my-6 text-lg font-bold'>Calcul de l’indice de transparence gloabale</h3>
      <p className='my-6 text-lg'>
        L'indice de transparence globale, pour une année N, est la moyenne des indice des
        subventions et indice des marchés publics, arrondi à l'échelon supérieur en cas de virgule.
      </p>
      <h2 className='my-12 text-xl font-bold'>L’organisation du projet</h2>
      <h3 className='my-6 text-lg font-bold'>L'ingénierie de données</h3>
      <p className='my-6 text-lg'>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis quam cumque optio quod vero
        iusto voluptatem aspernatur placeat, dignissimos necessitatibus iure minima ipsum similique
        distinctio expedita pariatur temporibus tempora mollitia.
      </p>
      <h3 className='my-6 text-lg font-bold'>L'analyse des données</h3>
      <p className='my-6 text-lg'>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis quam cumque optio quod vero
        iusto voluptatem aspernatur placeat, dignissimos necessitatibus iure minima ipsum similique
        distinctio expedita pariatur temporibus tempora mollitia.
      </p>
      <h3 className='my-6 text-lg font-bold'>
        L'architecture d'information et l'expérience utilisateur
      </h3>
      <p className='my-6 text-lg'>
        Notre démarche s’appuie sur des principes agiles et centrés sur l’utilisateur, tout en
        adoptant une approche transparente, collaborative et progressive, dans le but de rendre
        accessibles à tous les citoyens les données publiques essentielles liées à la gestion des
        collectivités locales.
      </p>
      <h4 className='my-6 text-base font-bold'>Design Thinking</h4>
      <p className='my-6 text-lg'>
        Nous avons appliqué la méthodologie Design Thinking pour comprendre en profondeur les
        besoins des utilisateurs. Cela a permis de définir des solutions innovantes en prenant en
        compte l’expérience utilisateur, l’accessibilité des données publiques et l’engagement des
        citoyens.
      </p>
      <h4 className='my-6 text-base font-bold'>Personas et Identification des utilisateurs</h4>
      <p className='my-6 text-lg'>
        Nous avons créé des personas basés sur les différents profils d’utilisateurs (citoyens,
        élus, chercheurs, journalistes) afin de comprendre leurs attentes et leurs parcours. Cette
        étape nous a permis de mieux définir les fonctionnalités et d’orienter le design de manière
        pertinente.
      </p>
      <h4 className='my-6 text-base font-bold'>Story Mapping</h4>
      <p className='my-6 text-lg'>
        En utilisant la technique de Story Mapping, nous avons découpé les fonctionnalités en
        thématique et user stories pour prioriser les éléments clés à développer. Cela a facilité la
        gestion de notre backlog et permis de structurer les sprints de développement pour répondre
        au mieux aux besoins des utilisateurs.
      </p>
      <h4 className='my-6 text-base font-bold'>User Flow, Arborescence et Wireframing</h4>
      <p className='my-6 text-lg'>
        À partir des User Flows et de l’arborescence du site, nous avons conçu des wireframes
        (maquette basse fidélité) pour tester les interactions et le parcours utilisateur de manière
        simple et intuitive. Cela a permis de valider les principales interactions avant de passer à
        la conception visuelle détaillée (maquette haute définition) à partir de la charte graphique
        élaborer par l’équipe design.
      </p>
      <h4 className='my-6 text-base font-bold'>Prototypage et Développement Agile</h4>
      <p className='my-6 text-lg'>
        Le prototypage a évolué en designs haute fidélité. Nous avons opté pour une approche agile
        et itérative, permettant des ajustements réguliers et une prise en compte des retours
        (association et membre du projet) à chaque étape du projet. Le développement a avancé
        parallèlement à la création des maquettes. Chaque fonctionnalité a été intégrée au fur et à
        mesure, avec un focus sur les sections principales (consultation des données, interpellation
        des élus, etc.).
      </p>
      <h4 className='my-6 text-base font-bold'>Conception de la recherche et de la comparaison</h4>
      <p className='my-6 text-lg'>
        Nous avons conçu des outils de recherche avancée et de comparaison des collectivités, afin
        de permettre aux utilisateurs de filtrer et analyser les données en fonction de critères
        spécifiques (population, budget, score de transparence).
      </p>
      <h4 className='my-6 text-base font-bold'>Tests Utilisateurs et Itérations</h4>
      <p className='my-6 text-lg'>
        Bien que les tests utilisateurs formels aient été limités, nous avons procédé à des tests
        informels au fil de l’avancement pour ajuster l’interface en fonction des retours internes.
      </p>
      <h4 className='my-6 text-base font-bold'>Mise en Production et Suivi</h4>
      <p className='my-6 text-lg'>
        Le lancement de la version MVP permettra de tester l’outil en conditions réelles, avec une
        attention particulière portée aux retours des utilisateurs pour des améliorations continues.
        Cela nous permet de garantir une expérience fluide et intuitive, tout en restant flexible
        pour apporter des améliorations continues à la plateforme Éclaireur Public.
      </p>
      <h3 className='my-6 text-lg font-bold'>Le développement</h3>
      <p className='my-6 text-lg'>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis quam cumque optio quod vero
        iusto voluptatem aspernatur placeat, dignissimos necessitatibus iure minima ipsum similique
        distinctio expedita pariatur temporibus tempora mollitia.
      </p>
    </main>
  );
}
