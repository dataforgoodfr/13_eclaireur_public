import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Le contexte',
  description:
    'À chaque échelon territorial son ensemble de compétences particulières, revue de détails et enjeux de la transparence',
};

export default function Page() {
  return (
    <main className='mx-auto mb-12 w-full max-w-screen-lg p-6' id='interpeller'>
      <h1 className='text-3xl font-bold'>Le contexte</h1>
      <p className='my-6 text-lg'>
        D'aucuns s'accordent pour louer les bienfaits d'une meilleure transparence des dépenses
        publiques.
        <br />
        La défiance toujours plus grandissante des citoyens envers l'impôt démontre
        l'imcompréhension de la dépense publique à tous les échelons.
        <br />
        Les services publics comme l'éducation, la santé, ainsi que ceux au niveau local tels que le
        ramassage des ordures, l'entretien de la voirie, les services municipaux etc... demeurent
        des concepts plus ou moins abstraits. Qu'une meilleure transparence rendrait de facto plus
        palpables et concrets.
        <br />
        Alors quels services publics, quelles compétences relèvent de quelles collectivités ? Revue
        de détail.
      </p>
      <h2 className='my-12 text-2xl font-bold'>Les échelons des collectivités territoriales</h2>
      <p className='my-6 text-lg'>
        En France, l’État a réparti ses responsabilités entre différents niveaux de collectivités
        territoriales. C’est ce qu’on appelle la décentralisation. L’idée est de gérer chaque
        domaine public au niveau le plus adapté. Ainsi, les communes, les départements et les
        régions ont chacun des rôles bien définis.
      </p>
      <h3 className='my-12 text-xl font-bold'>La commune</h3>
      <p className='my-6 text-lg'>
        La commune est l’échelon le plus proche des citoyens. Ses principales responsabilités
        incluent :
      </p>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>La gestion de l’état civil</li>
        <li className='my-6 text-lg'>L’urbanisme local</li>
        <li className='my-6 text-lg'>L’entretien des écoles primaires</li>
        <li className='my-6 text-lg'>La gestion des équipements culturels et sportifs locaux</li>
        <li className='my-6 text-lg'>L’action sociale de proximité</li>
      </ul>
      <p>
        <Link
          href='https://www.vie-publique.fr/infographie/270295-infographie-quel-est-le-role-du-conseil-municipal'
          className='border-b-2 border-black'
        >
          En savoir plus : le rôle du conseil municipal?
        </Link>
      </p>
      <h3 className='my-12 text-xl font-bold'>Le département</h3>
      <p className='my-6 text-lg'>
        Le département joue un rôle clé dans la solidarité sociale et territoriale. Ses compétences
        principales sont :
      </p>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>
          L’action sociale (aide à l’enfance, aux personnes âgées et handicapées)
        </li>
        <li className='my-6 text-lg'>La gestion des collèges</li>
        <li className='my-6 text-lg'>L’entretien des routes départementales</li>
        <li className='my-6 text-lg'>Le soutien aux communes rurales</li>
      </ul>
      <p>
        <Link
          href='https://www.vie-publique.fr/infographie/270019-infographie-quelles-sont-les-competences-du-departement'
          className='border-b-2 border-black'
        >
          En savoir plus : les compétences du département
        </Link>
      </p>
      <h3 className='my-12 text-xl font-bold'>La région</h3>
      <p className='my-6 text-lg'>
        La région a des responsabilités plus larges, axées sur le développement et l’aménagement du
        territoire :
      </p>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>Le développement économique et l’aide aux entreprises</li>
        <li className='my-6 text-lg'>L’aménagement du territoire et les transports</li>
        <li className='my-6 text-lg'>La gestion des lycées</li>
        <li className='my-6 text-lg'>La formation professionnelle et l’apprentissage</li>
        <li className='my-6 text-lg'>La protection de l’environnement</li>
      </ul>
      <p>
        <Link
          href='https://www.vie-publique.fr/infographie/280077-infographie-quelles-sont-les-competences-de-la-region'
          className='border-b-2 border-black'
        >
          En savoir plus : le rôle de la région
        </Link>
      </p>
      
    </main>
  );
}
