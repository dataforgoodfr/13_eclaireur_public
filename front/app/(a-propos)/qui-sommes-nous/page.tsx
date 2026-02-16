import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Card } from '#components/ui/card';

export const metadata: Metadata = {
  title: 'Qui sommes-nous ?',
  description:
    "Eclaireur Public c'est Anticor, Data for Good et une cinquantaine de bénévoles",
};

export default function Page() {
  return (
    <main>
      <div className="flex h-[200px] flex-col justify-center bg-[url('/eclaireur/project_background.webp')] bg-cover bg-center bg-no-repeat lg:h-[300px]">
        <h1 className='mx-auto w-full p-4 md:p-8 xl:max-w-[1128px] xl:p-0'>Qui sommes-nous ?</h1>
      </div>
      <div className='m-4 rounded-3xl border border-primary-light p-8 md:m-16 xl:mx-auto xl:max-w-[1128px]'>
        <p className='hidden text-3xl font-extrabold md:block md:text-4xl'>
          Eclaireur Public est le fruit de la collaboration entre ANTICOR et Data for Good.
        </p>
        <div className='my-10 grid gap-10 md:grid-cols-2'>
          <div className='flex h-full w-full flex-col'>
            <div className='relative mb-4 h-[90px]'>
              <Image src='/anticor.png' fill objectFit='contain' alt="Logo d'ANTICOR" />
            </div>
            <WhoWeAreCard colorClassName='bg-indigo-100 flex-1'>
              <h2 className='my-5 text-2xl font-extrabold md:text-3xl'>ANTICOR</h2>
              <p className='my-3 text-lg'>
                ANTICOR est une association transpartisane qui vise à lutter contre la corruption
                afin de réhabiliter le rapport de confiance qui doit exister entre les citoyens et
                leurs représentants – autant politiques qu'administratifs.
              </p>
              <p className='my-3 text-lg'>
                Son action porte sur l'invitation d'engagement des candidats sur l'éthique ainsi que
                l'accompagnement des lanceurs d'alerte pour les affaires judiciaires.
              </p>
              <p className='my-3 text-lg'>
                Pour en savoir plus :{' '}
                <Link href='https://anticor.org/' className='border-b-2 border-black'>
                  visiter le site d'ANTICOR
                </Link>
              </p>
            </WhoWeAreCard>
          </div>
          <div className='flex h-full w-full flex-col'>
            <div className='relative mb-4 h-[90px]'>
              <Image src='/dataforgood.webp' fill objectFit='contain' alt='Logo de Data for Good' />
            </div>
            <WhoWeAreCard colorClassName='bg-brand-3 flex-1'>
              <h2 className='my-5 text-2xl font-extrabold md:text-3xl'>Data for Good</h2>
              <p className='my-3 text-lg'>
                Data for Good est un collectif réunissant des professionnels et des porteurs de
                projets à impact positif afin d'accompagner ces derniers à la mise en place concrète
                de ces projets.
              </p>
              <p className='my-3 text-lg'>
                Son action s'articule via la mobilisation des compétences, la formation des citoyens
                et des bénévoles ainsi que la réflexion sur l'intelligence artificielle.
              </p>
              <p className='my-3 text-lg'>
                Pour en savoir plus :{' '}
                <Link href='https://dataforgood.fr/' className='border-b-2 border-black'>
                  visiter le site de Data for Good
                </Link>
              </p>
            </WhoWeAreCard>
          </div>
        </div>
        <div className='mt-10 text-center'>
          <Image
            src='/eclaireur/volunteer_activism.svg'
            alt='Volontaires'
            width={49}
            height={49}
            className='mr-2 inline-block'
          />
          <h3 className='my-5 text-4xl font-extrabold'>Les bénévoles</h3>
          <p className='my-3 text-lg md:text-xl'>
            Anticor et Data for Good remercient chaleureusement tous les bénévoles qui se sont
            impliqués.
          </p>
        </div>
      </div>
    </main>
  );
}

const WhoWeAreCard = ({
  children,
  colorClassName,
}: {
  children: React.ReactNode;
  colorClassName: string;
}) => (
  <Card className={`flex w-full flex-col justify-between p-4 ${colorClassName}`}>{children}</Card>
);
