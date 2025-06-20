import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Qui sommes-nous ?',
  description:
    'Eclaireur Public c\'est Anticor, Transparency International France, Data for Good et une cinquantaine de bénévoles',
};
export default function Page() {
  return (
    <main className='mx-auto mb-12 w-full max-w-screen-lg p-6' id='interpeller'>
      <h1 className='text-3xl font-bold'>Qui sommes-nous ?</h1>
      <p className='my-6 text-lg'>
        Eclaireur Public est le fruit de la collaboration entre Transparency International France,
        ANTICOR et Data for Good.
      </p>
      <h2 className='my-5 text-xl font-bold'>Transparency International France</h2>
      <Image
        className='float-right'
        src='/transparency-international-france.png'
        width={300}
        height={91}
        alt=''
      />
      <p className='my-6 text-lg'>
        Transparency International France est une association qui vise à promouvoir la transparence
        afin qu’Etats, entreprises, société civiles et individus ne soient plus confrontés à la
        corruption.
      </p>
      <p className='my-6 text-lg'>
        Son action porte sur 3 axes - le plaidoyer, le contentieux et l’accompagnement.
      </p>
      <p className='my-6 text-lg'>
        Pour en savoir plus :{' '}
        <Link href='https://transparency-france.org/' className='border-b-2 border-black'>
          visiter le site de Transparency International France
        </Link>
      </p>
      <h2 className='my-5 text-xl font-bold'>ANTICOR</h2>
      <Image className='float-right' src='/anticor.png' width={300} height={113} alt='' />
      <p className='my-6 text-lg'>
        ANTICOR est une association transpartisane qui vise à lutter contre la corruption afin de
        réhzbiliter le rapport de confiance qui doit exiter entre les citoyens et leurs
        représentants – autant politiques qu’administratifs.
      </p>
      <p className='my-6 text-lg'>
        Son action porte sur l’invitation d’engagement des candidats sur l’éthique ainsi que
        l’accompagnement des lanceurs d’alerte pour les affaires judiciaires.
      </p>
      <p className='my-6 text-lg'>
        Pour en savoir plus :{' '}
        <Link href='https://anticor.org/' className='border-b-2 border-black'>
          visiter le site d’ANTICOR
        </Link>
      </p>
      <h2 className='my-5 text-xl font-bold'>Data for Good</h2>
      <Image className='float-right' src='/dataforgood.jpg' width={300} height={300} alt='' />
      <p className='my-6 text-lg'>
        Data for Good est un collectif réunissant des professionnels et des porteurs de projets à
        impact positif afin d’accompagner ces derniers à la mise en place concrète de ces projets.
      </p>
      <p className='my-6 text-lg'>
        Son action s’articule via la mobilisation des compétences, la formation des citoyens et des
        bénévoles ainsi que la réflexion sur l’intelligence artificielle.
      </p>
      <p className='my-6 text-lg'>
        Pour en savoir plus :{' '}
        <Link href='https://dataforgood.fr/' className='border-b-2 border-black'>
          visiter le site de Data for Good
        </Link>
      </p>
      <h2 className='my-5 text-xl font-bold'>Les bénévoles</h2>
      <p className='my-6 text-lg'>
        Transparency International France, Anticor et Data for Good remercient chaleureusement tous
        les bénévoles qui se sont impliqués.
      </p>
    </main>
  );
}
