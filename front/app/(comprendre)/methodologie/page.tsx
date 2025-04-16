import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "La méthodologie ou les dessous de l'outil Éclaireur Public",
  description:
    'Comment réunir savoir-faire, technologies dernier cri et bonnes volontés pour la transparence des données publiques, revue de détails',
};

export default function page() {
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
        https://github.com/m4xim1nus/LocalOuvert
      </p>
      <p className='my-6 text-lg'>
        Décision est prise fin 2024 par TIF et Anticor de faire appel au réseau de bénévolat Data
        For Good le bien nommé pour répondre aux attentes d’un projet d’ouverture des données
        d’envergure au service du bien public.
      </p>
      <p className='my-6 text-lg'>
        Fin février, le projet, parmi 11 autres, est présenté aux bénévoles sur la chaîne YouTube de
        Data For Good.
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
        <img src='index-subventions.png' width='810' height='116' alt='' />
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
        <img src='index-mp.png' width='811' height='237' alt='' />
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
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis quam cumque optio quod vero
        iusto voluptatem aspernatur placeat, dignissimos necessitatibus iure minima ipsum similique
        distinctio expedita pariatur temporibus tempora mollitia.
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
