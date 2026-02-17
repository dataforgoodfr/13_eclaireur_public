import type { Metadata } from 'next';

import { SectionHeader } from '#app/components/SectionHeader';

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
            La loi pour une République numérique de 2016 promettait d'apporter transparence et
            accessibilité des données publiques via leur mise à disposition numérique.
          </p>
          <p>
            Force est de constater que l'ouverture et la publication de ces données ne sont que très
            partielles. Nos analyses montrent que la grande majorité des collectivités ne publient
            pas ou peu de données exploitables sur leurs dépenses, et la situation est
            particulièrement critique sur les subventions.
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
          <p>
            Un indice de transparence a été élaboré afin de pouvoir comparer les collectivités de
            même nature et de même taille démographique.
          </p>
        </div>
        <div>
          <h2 className='mb-4'>Pourquoi un diagnostic&nbsp;?</h2>
          <p>
            Comment ma commune dépense son budget chaque année&nbsp;? Quelles sont les structures
            subventionnées&nbsp;? Quels sont les marchés publics en cours&nbsp;? Telles sont les
            questions que tout citoyen se pose légitimement et auxquelles le projet Eclaireur Public
            aimerait être en mesure d'apporter une réponse. Et si tel n'est pas le cas, donner les
            moyens de questionner nos élus locaux.
          </p>
        </div>
        <div>
          <h2 className='mb-4'>Mais quel intérêt vraiment&nbsp;?</h2>
          <p>
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
        </div>
      </article>
    </main>
  );
}
