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
        <h1 className='global-margin mx-auto'>
          La méthodologie ou <br /> les dessous de l'outil Éclaireur Public
        </h1>
      </div>
      <div className='global-margin mx-auto my-16 rounded-3xl border border-primary-light p-10'>
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
      <div className='global-margin mx-auto my-16 rounded-3xl border border-primary-light p-10'>
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
      <div className='global-margin mx-auto my-16 rounded-3xl border border-primary-light p-10'>
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
    </main>
  );
}
