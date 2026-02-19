import type { Metadata } from 'next';
import Link from 'next/link';

import { SectionHeader } from '#app/components/SectionHeader';
import { BarChart2, ChevronRight, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Le Projet',
  description:
    'Éclaireur Public a deux objectifs principaux : ouvrir les données des collectivités locales, éclairer et informer les citoyens sur les enjeux locaux',
};
export default function LeProjet() {
  return (
    <main>
      <SectionHeader sectionTitle='Le Projet' />
      <article className='section-format space-y-8'>
        <div>
          <h2 className='mb-4'>Pourquoi ce projet&nbsp;?</h2>
          <p className='mb-4'>
            La{' '}
            <Link href='/cadre-reglementaire' className='underline'>
              loi pour une République numérique de 2016
            </Link>{' '}
            promettait d'apporter transparence et accessibilité des données publiques via leur mise
            à disposition numérique.
          </p>
          <p>
            En 2025, force est de constater que l'ouverture et la publication de ces données ne sont
            que très partielles. Nos analyses montrent que la grande majorité des collectivités{' '}
            <Link href='/perspectives' className='underline'>
              ne publient pas leurs subventions
            </Link>
            .
          </p>
        </div>
        <div>
          <h2 className='mb-4'>Un diagnostic de la transparence publique</h2>
          <p className='mb-4'>
            L'objet du projet Eclaireur Public est d'établir un diagnostic de l'application de cette
            loi à tous les échelons de collectivités à savoir au niveau des communes,
            intercommunalités, départements, métropoles/agglomérations, régions.
          </p>
          <p className='mb-4'>
            La visualisation de données (cartographies, graphiques en bâtons, treemap) est le mode
            privilégié pour rendre ce diagnostic le plus lisible et accessible au plus grand nombre.
          </p>
          <p className='mb-6'>
            <Link href='/methodologie' className='underline'>
              Un indice de transparence a été élaboré
            </Link>{' '}
            afin de pouvoir comparer les collectivités de même nature et de même taille
            démographique.
          </p>
          <Link
            href='/perspectives'
            className='inline-flex items-center gap-2 rounded-br-xl rounded-tl-xl bg-primary px-5 py-3 font-semibold text-white'
          >
            <BarChart2 className='h-4 w-4' />
            Explorer les données
            <ChevronRight className='h-4 w-4' />
          </Link>
        </div>
        <div>
          <h2 className='mb-4'>Pourquoi un diagnostic&nbsp;?</h2>
          <p>
            Comment ma commune dépense son budget chaque année&nbsp;? Quelles sont les structures
            subventionnées&nbsp;? Quels sont les marchés publics en cours&nbsp;? Telles sont les
            questions que tout citoyen se pose légitimement et auxquelles le projet Eclaireur Public
            aimerait être en mesure d'apporter une réponse. Et si tel n'est pas le cas, donner les
            moyens de{' '}
            <Link href='/interpeller' className='underline'>
              questionner nos élus locaux
            </Link>
            .
          </p>
        </div>
        <div>
          <h2 className='mb-4'>Mais quel intérêt vraiment&nbsp;?</h2>
          <p className='mb-6'>
            Le citoyen lambda déclare ses revenus, s'acquitte des ses impôts, se conforme à la
            loi... pour "faire société". Aucune raison ne justifie que nos collectivités ne se
            conforment pas à leurs obligations légales d'information. La désaffection des citoyens
            envers leurs élus n'a jamais été aussi forte. L'information publique factuelle,
            apolitique et transparente constitue une des composantes du rapprochement des individus
            avec l'intérêt général et la question publique. Ces données, lorsqu'elles sont
            transparentes, permettent aussi d'éclairer les décisions publiques, les engagements
            politiques, les journalistes, les chercheurs et les élus eux-mêmes. Enfin, la probité
            politique et la lutte contre la corruption nécessitent une plus grande transparence des
            politiques publiques, et donc des données publiques.
          </p>
          <Link
            href='/interpeller'
            className='inline-flex items-center gap-2 rounded-br-xl rounded-tl-xl bg-brand-3 px-5 py-3 font-semibold'
          >
            <MessageSquare className='h-4 w-4' />
            Interpeller vos élus
            <ChevronRight className='h-4 w-4' />
          </Link>
        </div>
      </article>
    </main>
  );
}
