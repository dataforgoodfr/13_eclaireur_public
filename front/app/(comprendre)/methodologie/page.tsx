import type { Metadata } from 'next';
import Link from 'next/link';

import { CRITERIA } from '@/utils/constants';

export const metadata: Metadata = {
  title: "La méthodologie ou les dessous de l'outil Éclaireur Public",
  description:
    'Comment réunir savoir-faire, technologies dernier cri et bonnes volontés pour la transparence des données publiques, revue de détails',
};

export default function Page() {
  return (
    <main>
      <div className="flex h-[300px] flex-col justify-center bg-[url('/eclaireur/project_background.webp')] bg-cover bg-center bg-no-repeat">
        <h1 className='mx-auto max-w-[1128px]'>
          La méthodologie ou <br /> les dessous de l'outil Éclaireur Public
        </h1>
      </div>
      <div className='doc-margin'>
        <h2 className='mb-10'>
          Comment réunir savoir-faire, technologies dernier cri et bonnes volontés pour la
          transparence des données publiques, revue de détails
        </h2>
        <h4 className='my-10'>
          Eclaireur Public a vocation à éclairer les citoyens sur les données publiques, et
          particulièrement sur les subventions et marchés publics des différentes strates composant
          les collectivités territoriales, à savoir communes, intercommunalités,
          agglomérations/métropoles, départements et régions.
        </h4>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
          <div className='space-y-6'>
            <p className='text-lg'>
              Pour parvenir à ces fins, Transparency International France et Anticor ont rédigé de
              concert un document préparatoire intitulé « Eclaireur Public - Analyse de la
              transparence des collectivités locales » définissant les objectifs généraux et un
              cadre qui donne corps à l'objet « Eclaireur Public », site internet « permettant aux
              visiteurs de consulter des données à jour sur sa collectivité locale ».
            </p>
            <p className='text-lg'>
              Avec comme objectif sous-jacent, l'accompagnement des acteurs de ces collectivités et
              l'incitation à améliorer la transparence de ces structures.
            </p>
          </div>
          <div className='space-y-6'>
            <p>
              Un pré-travail de défrichage des données (via un pipeline de scraping automatisé)
              avait été mis en place grâce à un script en langage Python pour récupérer les données
              spécifiquement sur data.gouv.fr. L'algorithme est disponible en open source à
              l'adresse suivante :{' '}
              <Link
                href={'https://github.com/m4xim1nus/LocalOuvert'}
                className='font-medium hover:underline'
                target='_blank'
                rel='noopener noreferrer'
              >
                https://github.com/m4xim1nus/LocalOuvert
              </Link>
            </p>
            <p>
              Décision est prise fin 2024 par TIF et Anticor de faire appel au réseau de bénévolat
              Data For Good le bien nommé pour répondre aux attentes d'un projet d'ouverture des
              données d'envergure au service du bien publi
            </p>
            <p>
              Fin février, le projet, parmi 11 autres, est présenté aux bénévoles sur la chaîne{' '}
              <Link
                href={'https://www.youtube.com/watch?v=pwBhVAz8_uY&ab_channel=DataforGood'}
                className='font-medium hover:underline'
                target='_blank'
                rel='noopener noreferrer'
              >
                Youtube de Data For Good
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
      <div className='doc-margin'>
        <h2 className='mb-10'>La collecte des données</h2>
        <h4 className='my-10'>
          En théorie, les données sur les subventions et les marchés publics sont toutes disponibles
          en « open data » sur le site dédié aux données censées être publiques data.gouv.fr.
        </h4>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
          <div className='space-y-6'>
            <p className='text-lg'>
              En réalité, les données sont disséminées en de multiples endroits que seul-e-s des
              professionnels de la donnée numérique, des data engineers aux data analysts jusqu'aux
              data scientists, sans compter quelques nerds psychopathes des données de tout poil,
              sont capables de les exhumer.
            </p>
          </div>
          <div className='space-y-6'>
            <p className='font-bold'>
              À l'initialisation du projet (en avril 2025), 31 jeux de données ont été nécessaires
              pour mettre en place cet outil, Eclaireur Public, dont voici les principaux :
            </p>
            <ul className='list-disc pl-5'>
              <li>OFGL Régions</li>
              <li>OFGL Départements</li>
              <li>OFGL Communes</li>
              <li>OFGL Intercommunalités</li>
              <li>OFGL Départements</li>
            </ul>
          </div>
        </div>
      </div>
      <div className='doc-margin'>
        <h2 className='mb-10'>L'élaboration d'un indice de transparence des collectivités</h2>
        <p>
          Il est apparu évident, et nécessaire, dès le début que pour comparer les collectivités
          entre elles et pour mesurer leur degré d'ouverture des données publiques, il fallait
          construire un indice qui repose sur un certain nombre de critères objectifs. Le groupe de
          travail « barème de transparence », en étroite collaboration avec TIF et Anticor a
          finalement élaboré 3 indices de transparence, calqué sur une notation allant de A à E
          (comme le nutriscore) :{' '}
        </p>
        <ul className='list-disc pl-5'>
          <li>l'indice de transparence des subventions</li>
          <li>l'indice de transparence des marchés publics</li>
          <li>l'indice de transparence agrégé des 2 indices précédents</li>
        </ul>
        <h3 className='mb-4 mt-10'>Calcul de l'indice de transparence des subventions</h3>
        <p className='font-bold'>
          L'indice de transparence des marchés publics est établi selon la conjonction de 3 facteurs
          principaux :
        </p>
        <ul className='list-disc pl-5'>
          <li>la publication de données sur les marchés inférieurs à 40000 €</li>
          <li>la publication de données sur les marchés supérieurs à 40000 €</li>
          <li>la publication de données sur les 10 critères suivants :</li>
        </ul>
        <div className='my-8 flex flex-wrap gap-2'>
          {CRITERIA.map((criterion) => (
            <div key={criterion} className='rounded-full bg-secondary-200 px-5 py-3 font-semibold'>
              {criterion}
            </div>
          ))}
        </div>
        <p>
          La grille ci-dessous établit les notes de transparence, de A à E. Plus la collectivité
          remplit les critères, meilleure est sa note.
        </p>
        <p className='mb-2 mt-4 text-sm font-bold'>Barème de transparence des marchés publics</p>
        <div className='grid grid-cols-5 text-2xl font-bold'>
          <div className='flex h-[68px] flex-col justify-center rounded-l-md bg-scoreIndice-A text-center'>
            A
          </div>
          <div className='flex h-[68px] flex-col justify-center bg-scoreIndice-B text-center'>
            B
          </div>
          <div className='flex h-[68px] flex-col justify-center bg-scoreIndice-C text-center'>
            C
          </div>
          <div className='flex h-[68px] flex-col justify-center bg-scoreIndice-D text-center'>
            D
          </div>
          <div className='flex h-[68px] flex-col justify-center rounded-r-md bg-scoreIndice-E text-center'>
            E
          </div>
        </div>
        <div className='mt-4 grid grid-cols-5 gap-6 text-sm font-medium'>
          <div className=''>
            Données communiquées, avec des montants supérieurs ou inférieurs à 40 000 euros, les 10
            points de données sont alimentés et la date de publication est en moyenne inférieure à 2
            mois à compter de la date de notification.
          </div>
          <div className=''>
            Données communiquées avec des montants supérieurs ou obligatoires à 40 000 et les 10
            données ci-dessous sont alimentées : code CPV, montant, date de notification, lieu
            exécution, lieu d’exécution nom, forme de prix, objet, nature, durée en mois, procédure,
            titulaire.
          </div>
          <div className=''>
            Communiquées avec des montants supérieurs ou inférieurs à 40 000 euros.
          </div>
          <div className=''>Données communiquées avec des montants supérieurs à 40 000.</div>
          <div className=''>Données non communiquées.</div>
        </div>
        <h3 className='mb-4 mt-10'>Calcul de l’indice de transparence des subventions</h3>
        <p>
          Pour une année N, l'indice de transparence des subventions d'une collectivité se calcule
          comme suit : Somme des subventions détaillées divisée par somme totale des subventions
          indiquée dans le budget du compte administratif. La grille ci-dessous établit les notes de
          transparence, de A à E, en fonction du taux de publication, la valeur A étant la note
          maximale avec un taux de publication de 100 %, et la valeur E la note la plus basse avec
          un taux de publication inférieur{' '}
        </p>
        <p>
          La grille ci-dessous établit les notes de transparence, de A à E. Plus la collectivité
          remplit les critères, meilleure est sa note.
        </p>
        <p className='mb-2 mt-4 text-sm font-bold'>
          Variable : taux de publication (en valeur) = somme Subventions Détaillées / Budget Compte
          Administratif
        </p>
        <div className='grid grid-cols-5 text-2xl font-bold'>
          <div className='flex h-[68px] flex-col justify-center rounded-l-md bg-scoreIndice-A text-center'>
            A
          </div>
          <div className='flex h-[68px] flex-col justify-center bg-scoreIndice-B text-center'>
            B
          </div>
          <div className='flex h-[68px] flex-col justify-center bg-scoreIndice-C text-center'>
            C
          </div>
          <div className='flex h-[68px] flex-col justify-center bg-scoreIndice-D text-center'>
            D
          </div>
          <div className='flex h-[68px] flex-col justify-center rounded-r-md bg-scoreIndice-E text-center'>
            E
          </div>
        </div>
        <div className='mt-4 grid grid-cols-5 gap-6 text-center font-bold'>
          <div>100% (+/- 5%)</div>
          <div>De 75% à 95%</div>
          <div>De 50% à 75%</div>
          <div>De 25% à 50%</div>
          <div className='flex flex-col space-y-2 px-2'>
            <span>Moins de 25% ou données inexploitables</span>
            <span className='font-normal'>
              Si plus de 105% → <span className='font-bold'>E</span>
            </span>
          </div>
        </div>
        <h3 className='mb-4 mt-10'>Calcul de l'indice de transparence globale - Score Agrégé</h3>
        <p className='mb-4'>
          L'indice de transparence globale, pour une année N, est la moyenne des indice des
          subventions et indice des marchés publics, arrondi à l'échelon supérieur en cas de
          virgule.
        </p>
        <div className='grid grid-cols-5 text-2xl font-bold'>
          <div className='flex h-[68px] flex-col justify-center rounded-l-md bg-score-A text-center'>
            A
          </div>
          <div className='flex h-[68px] flex-col justify-center bg-score-B text-center'>B</div>
          <div className='flex h-[68px] flex-col justify-center bg-score-C text-center'>C</div>
          <div className='flex h-[68px] flex-col justify-center bg-score-D text-center'>D</div>
          <div className='flex h-[68px] flex-col justify-center rounded-r-md bg-score-E text-center'>
            E
          </div>
        </div>
      </div>
      <div className='doc-margin'>
        <h2 className='mb-10'>L'organisation du projet</h2>
        <div className='hidden md:block'>
          <div className='my-8 grid grid-cols-2 gap-8'>
            <div className='space-y-2'>
              <h4>L'ingénierie de données</h4>
              <p>
                Nous avons développé des scripts et automatisations pour collecter, nettoyer et
                structurer les données issues de différentes sources (
                <Link
                  href={'https://www.data.gouv.fr/'}
                  target='_blank'
                  className='font-medium hover:underline'
                >
                  data.gouv.fr
                </Link>{' '}
                , sites institutionnels, etc.). Ce travail de fond a permis de transformer des
                fichiers parfois bruts ou hétérogènes en bases de données cohérentes, exploitables
                et comparables entre collectivités.
              </p>
            </div>
            <div className='space-y-2'>
              <h4>L'analyse des données</h4>
              <p>
                Une fois les données structurées, nous les avons analysées afin de créer des
                indicateurs de transparence clairs et pertinents. Cette étape a consisté à définir
                les critères de calcul des indices (par exemple : délais de publication,
                exhaustivité des informations, cohérence des formats), puis à automatiser le
                traitement pour obtenir des résultats fiables et reproductibles.
              </p>
            </div>
          </div>
          <div className='my-8 grid grid-cols-2 gap-8'>
            <div className='space-y-2'>
              <h4>L'architecture d'information et l'expérience utilisateur</h4>
              <p>
                Notre démarche s'appuie sur des principes agiles et centrés sur l'utilisateur, tout
                en adoptant une approche transparente, collaborative et progressive, dans le but de
                rendre accessibles à tous les citoyens les données publiques essentielles liées à la
                gestion des collectivités locales.
              </p>
            </div>
            <div className='space-y-2'>
              <h4>Design Thinking</h4>
              <p>
                Nous avons appliqué la méthodologie Design Thinking pour comprendre en profondeur
                les besoins des utilisateurs. Cela a permis de définir des solutions innovantes en
                prenant en compte l'expérience utilisateur, l'accessibilité des données publiques et
                l'engagement des citoyens.
              </p>
            </div>
          </div>
          <div className='my-8 grid grid-cols-2 gap-8'>
            <div className='space-y-2'>
              <h4>Personas et Identification des utilisateurs</h4>
              <p>
                Nous avons créé des personas basés sur les différents profils d'utilisateurs
                (citoyens, élus, chercheurs, journalistes) afin de comprendre leurs attentes et
                leurs parcours. Cette étape nous a permis de mieux définir les fonctionnalités et
                d'orienter le design de manière pertinente.
              </p>
            </div>
            <div className='space-y-2'>
              <h4>Story Mapping</h4>
              <p>
                En utilisant la technique de Story Mapping, nous avons découpé les fonctionnalités
                en thématique et user stories pour prioriser les éléments clés à développer. Cela a
                facilité la gestion de notre backlog et permis de structurer les sprints de
                développement pour répondre au mieux aux besoins des utilisateurs.
              </p>
            </div>
          </div>
          <div className='my-8 grid grid-cols-2 gap-8'>
            <div className='space-y-2'>
              <h4>User Flow, Arborescence et Wireframing</h4>
              <p>
                À partir des User Flows et de l'arborescence du site, nous avons conçu des
                wireframes (maquette basse fidélité) pour tester les interactions et le parcours
                utilisateur de manière simple et intuitive. Cela a permis de valider les principales
                interactions avant de passer à la conception visuelle détaillée (maquette haute
                définition) à partir de la charte graphique élaborer par l'équipe design
              </p>
            </div>
            <div className='space-y-2'>
              <h4>Prototypage et Développement Agile</h4>
              <p>
                Le prototypage a évolué en designs haute fidélité. Nous avons opté pour une approche
                agile et itérative, permettant des ajustements réguliers et une prise en compte des
                retours (association et membre du projet) à chaque étape du projet. Le développement
                a avancé parallèlement à la création des maquettes. Chaque fonctionnalité a été
                intégrée au fur et à mesure, avec un focus sur les sections principales
                (consultation des données, interpellation des élus, etc.).
              </p>
            </div>
          </div>
          <div className='my-8 grid grid-cols-2 gap-8'>
            <div className='space-y-2'>
              <h4>Conception de la recherche et de la comparaison</h4>
              <p>
                Nous avons conçu des outils de recherche avancée et de comparaison des
                collectivités, afin de permettre aux utilisateurs de filtrer et analyser les données
                en fonction de critères spécifiques (population, budget, score de transparence).
              </p>
            </div>
            <div className='space-y-2'>
              <h4>Tests Utilisateurs et Itérations</h4>
              <p>
                Bien que les tests utilisateurs formels aient été limités, nous avons procédé à des
                tests informels au fil de l'avancement pour ajuster l'interface en fonction des
                retours internes.
              </p>
            </div>
          </div>
          <div className='mt-8 grid grid-cols-2 gap-8'>
            <div className='space-y-2'>
              <h4>Mise en Production et Suivi</h4>
              <p>
                Le lancement de la version MVP permettra de tester l'outil en conditions réelles,
                avec une attention particulière portée aux retours des utilisateurs pour des
                améliorations continues. Cela nous permet de garantir une expérience fluide et
                intuitive, tout en restant flexible pour apporter des améliorations continues à la
                plateforme Éclaireur Public.
              </p>
            </div>
            <div className='space-y-2'>
              <h4>Le développement</h4>
              <p>
                Côté technique, nous avons conçu et mis en place la plateforme web permettant de
                restituer ces données de manière lisible et accessible à toutes et tous. Le
                développement s’est appuyé sur une approche agile : incrémenter les fonctionnalités
                au fil des sprints, tester régulièrement et intégrer les retours des utilisateurs.
                Cela garantit un outil robuste mais aussi évolutif, capable de s’enrichir en
                continu.
              </p>
            </div>
          </div>
        </div>
        <div className='block md:hidden'>
          <div className='mt-6 space-y-2'>
            <h4>L'ingénierie de données</h4>
            <p>
              Nous avons développé des scripts et automatisations pour collecter, nettoyer et
              structurer les données issues de différentes sources (
              <Link
                href={'https://www.data.gouv.fr/'}
                target='_blank'
                className='font-medium hover:underline'
              >
                data.gouv.fr
              </Link>{' '}
              , sites institutionnels, etc.). Ce travail de fond a permis de transformer des
              fichiers parfois bruts ou hétérogènes en bases de données cohérentes, exploitables et
              comparables entre collectivités.
            </p>
          </div>
          <div className='mt-6 space-y-2'>
            <h4>L'architecture d'information et l'expérience utilisateur</h4>
            <p>
              Notre démarche s'appuie sur des principes agiles et centrés sur l'utilisateur, tout en
              adoptant une approche transparente, collaborative et progressive, dans le but de
              rendre accessibles à tous les citoyens les données publiques essentielles liées à la
              gestion des collectivités locales.
            </p>
          </div>
          <div className='mt-6 space-y-2'>
            <h4>Personas et Identification des utilisateurs</h4>
            <p>
              Nous avons créé des personas basés sur les différents profils d'utilisateurs
              (citoyens, élus, chercheurs, journalistes) afin de comprendre leurs attentes et leurs
              parcours. Cette étape nous a permis de mieux définir les fonctionnalités et d'orienter
              le design de manière pertinente.
            </p>
          </div>
          <div className='mt-6 space-y-2'>
            <h4>User Flow, Arborescence et Wireframing</h4>
            <p>
              À partir des User Flows et de l'arborescence du site, nous avons conçu des wireframes
              (maquette basse fidélité) pour tester les interactions et le parcours utilisateur de
              manière simple et intuitive. Cela a permis de valider les principales interactions
              avant de passer à la conception visuelle détaillée (maquette haute définition) à
              partir de la charte graphique élaborer par l'équipe design
            </p>
          </div>
          <div className='mt-6 space-y-2'>
            <h4>Conception de la recherche et de la comparaison</h4>
            <p>
              Nous avons conçu des outils de recherche avancée et de comparaison des collectivités,
              afin de permettre aux utilisateurs de filtrer et analyser les données en fonction de
              critères spécifiques (population, budget, score de transparence).
            </p>
          </div>
          <div className='mt-6 space-y-2'>
            <h4>Mise en Production et Suivi</h4>
            <p>
              Le lancement de la version MVP permettra de tester l'outil en conditions réelles, avec
              une attention particulière portée aux retours des utilisateurs pour des améliorations
              continues. Cela nous permet de garantir une expérience fluide et intuitive, tout en
              restant flexible pour apporter des améliorations continues à la plateforme Éclaireur
              Public.
            </p>
          </div>
          <div className='mt-6 space-y-2'>
            <h4>L'analyse des données</h4>
            <p>
              Une fois les données structurées, nous les avons analysées afin de créer des
              indicateurs de transparence clairs et pertinents. Cette étape a consisté à définir les
              critères de calcul des indices (par exemple : délais de publication, exhaustivité des
              informations, cohérence des formats), puis à automatiser le traitement pour obtenir
              des résultats fiables et reproductibles.
            </p>
          </div>
          <div className='mt-6 space-y-2'>
            <h4>Design Thinking</h4>
            <p>
              Nous avons appliqué la méthodologie Design Thinking pour comprendre en profondeur les
              besoins des utilisateurs. Cela a permis de définir des solutions innovantes en prenant
              en compte l'expérience utilisateur, l'accessibilité des données publiques et
              l'engagement des citoyens.
            </p>
          </div>
          <div className='mt-6 space-y-2'>
            <h4>Story Mapping</h4>
            <p>
              En utilisant la technique de Story Mapping, nous avons découpé les fonctionnalités en
              thématique et user stories pour prioriser les éléments clés à développer. Cela a
              facilité la gestion de notre backlog et permis de structurer les sprints de
              développement pour répondre au mieux aux besoins des utilisateurs.
            </p>
          </div>
          <div className='mt-6 space-y-2'>
            <h4>Prototypage et Développement Agile</h4>
            <p>
              Le prototypage a évolué en designs haute fidélité. Nous avons opté pour une approche
              agile et itérative, permettant des ajustements réguliers et une prise en compte des
              retours (association et membre du projet) à chaque étape du projet. Le développement a
              avancé parallèlement à la création des maquettes. Chaque fonctionnalité a été intégrée
              au fur et à mesure, avec un focus sur les sections principales (consultation des
              données, interpellation des élus, etc.).
            </p>
          </div>
          <div className='mt-6 space-y-2'>
            <h4>Tests Utilisateurs et Itérations</h4>
            <p>
              Bien que les tests utilisateurs formels aient été limités, nous avons procédé à des
              tests informels au fil de l'avancement pour ajuster l'interface en fonction des
              retours internes.
            </p>
          </div>
          <div className='mt-6 space-y-2'>
            <h4>Le développement</h4>
            <p>
              Côté technique, nous avons conçu et mis en place la plateforme web permettant de
              restituer ces données de manière lisible et accessible à toutes et tous. Le
              développement s’est appuyé sur une approche agile : incrémenter les fonctionnalités au
              fil des sprints, tester régulièrement et intégrer les retours des utilisateurs. Cela
              garantit un outil robuste mais aussi évolutif, capable de s’enrichir en continu.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
