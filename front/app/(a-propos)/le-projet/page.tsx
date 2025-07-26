import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Le Projet',
  description:
    'Éclaireur Public a deux objectifs principaux : ouvrir les données des collectivités locales, éclairer et informer les citoyens sur les enjeux locaux',
};
export default function Page() {
  return (
    <main className='mx-auto mb-12 w-full max-w-screen-lg p-6' id='interpeller'>
      <h1 className='text-3xl font-bold'>Le projet</h1>
      <p className='my-6 text-lg'>
        La loi pour une République numérique de 2016 promettait d'apporter transparence et
        accessibilité des données publiques via leur mise à disposition numérique.
      </p>
      <p className='my-6 text-lg'>
        En 2025, force est de constater que l'ouverture et la publication de ces données ne sont que
        très partielles. Pour exemple, Anticor a évalué sur un échantillon que moins de 10% des
        subventions étaient rendues publiques par les différentes collectivités.
      </p>
      <h2 className='my-5 text-xl font-bold'>Un diagnostic de la transparence publique</h2>
      <p className='my-6 text-lg'>
        L'objet du projet Eclaireur Public est d'établir un diagnostic de l'application de cette loi
        à tous les échelons de collectivités à savoir au niveau des communes, intercommunalités,
        départements, métropoles/agglomérations, régions.
      </p>
      <p className='my-6 text-lg'>
        La visualisation de données (cartographies, graphiques en bâtons, treemap) est le mode
        privilégié pour rendre ce diagnostic le plus lisible et accessible au plus grand nombre.
      </p>
      <p className='my-6 text-lg'>
        Un indice de transparence a été élaboré afin de pouvoir comparer les collectivités de même
        nature et de même taille démographique.
      </p>
      <h2 className='my-5 text-xl font-bold'>Pourquoi un diagnostic ?</h2>
      <p className='my-6 text-lg'>
        Comment ma commune dépense son budget chaque année ? Quelles sont les structures
        subventionnées ? Quels sont les marchés publics en cours ? Telles sont les questions que
        tout citoyen se pose légitimement et auxquelles le projet Eclaireur Public aimerait être en
        mesure d'apporter une réponse. Et si tel n'est pas le cas, donner les moyens de questionner
        nos élus locaux.
      </p>
      <h2 className='my-5 text-xl font-bold'>Mais quel intérêt vraiment ?</h2>
      <p className='my-6 text-lg'>
        Le citoyen lambda déclare ses revenus, s'acquitte des ses impôts, se conforme à la loi...
        pour "faire société". Aucune raison ne justifie que nos collectivités ne se conforment pas à
        leurs obligations légales d'information.
      </p>

      <p className='my-6 text-lg'>
        La désaffection des citoyens envers nos élus n'a jamais été aussi forte. L'information
        publique factuelle, apolitique et transparente constitue une des composantes du
        rapprochement des individus avec l'intérêt général et la question publique.
      </p>

      <p className='my-6 text-lg'>
        Ces données, lorsqu'elles sont transparentes, permettent aussi d'éclairer les décisions
        publiques, les engagements politiques, les journalistes, les chercheurs et les élus
        eux-mêmes.
      </p>

      <p className='my-6 text-lg'>
        Enfin, la probité politique et la lutte contre la corruption nécessitent une plus grande
        transparence des politiques publiques, et donc des données publiques.{' '}
      </p>
    </main>
  );
}
