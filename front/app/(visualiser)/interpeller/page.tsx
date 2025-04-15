'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Stepper from '@/components/Interpellate/Stepper';
import SearchBar from '@/components/SearchBar/SearchBar';
import { buttonVariants } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export default function Page() {
  const router = useRouter();
  const goToStep1 = async (siren: string) => {
    router.push(`/interpeller/${siren}/step1`);
  };

  return (
    <section id='interpellation-step1-nocommunity' className='my-16'>
      <Stepper currentStep={1} />
      <article className='my-6 flex flex-col justify-start'>
        <h2 className='my-6 text-center text-2xl font-bold'>Trouver une collectivité</h2>
        <div className='ml-16 min-w-[400] self-center'>
          <SearchBar onSelect={({ siren }) => goToStep1(siren)} />
        </div>
      </article>
      <article className='my-16'>
        <h2 className='my-6 text-xl font-bold uppercase'>Pourquoi interpeller mes élu.e.s ?</h2>
        <img
          src='https://placehold.co/200/png'
          width='200'
          height='200'
          alt='*'
          className='float-right'
        />
        <p className='my-6'>
          Les collectivités sont légalement tenues de publier leurs données administratives en open
          data selon la loi pour une République Numérique de 2016, comme décrit en détail sur notre{' '}
          <Link href='/cadre-reglementaire' className='border-b-2 border-black'>
            page consacrée au cadre règlementaire
          </Link>
          .
        </p>
        <p className='my-6'>Seules 10% d’entre elles respectent cette obligation.</p>
        <p className='my-6'>
          Interpeller vos élu·es, c’est leur rappelez leur responsabilité démocratique et les
          encourager à mieux rendre compte de l'utilisation des fonds publics.
        </p>
        <p className='my-6'>
          Une meilleure publication des données permet de suivre plus factuellement les dépenses
          publiques, de prévenir d'éventuels abus et d'améliorer la confiance citoyenne.
        </p>
        <p className='my-6'>
          Votre engagement est un levier puissant pour renforcer la transparence, prévenir la
          corruption et faire évoluer les pratiques locales.
        </p>
        <p className='my-6'>
          <Link href='/le-projet' className={buttonVariants({ variant: 'outline' })}>
            En savoir plus <ChevronRight />
          </Link>
        </p>
      </article>
    </section>
  );
}
