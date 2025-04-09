'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Stepper from '@/components/Interpellate/Stepper';
import SearchBar from '@/components/SearchBar/SearchBar';
import { buttonVariants } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export default function Page() {
  // const [currentStep, setCurrentStep] = useState(0);
  const currentStep = 1;
  const NUMBER_OF_STEPS = 4;

  // const goToNextStep = () =>
  //   setCurrentStep((prev) => (prev === NUMBER_OF_STEPS - 1 ? prev : prev + 1));
  // const goToPreviousStep = () => setCurrentStep((prev) => (prev <= 0 ? prev : prev - 1));

  const router = useRouter();
  const goToStep1 = async (siren: string) => {
    router.push(`/interpeller/${siren}/step1`);
  };

  return (
    <section id='interpellation-step1-nocommunity' className='my-16'>
      <Stepper currentStep={currentStep} numberOfSteps={NUMBER_OF_STEPS} />
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis officiis at magnam
          recusandae incidunt nobis animi facere, illo harum est?
        </p>
        <p className='my-6'>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus dicta commodi, iste harum
          quisquam fugit placeat inventore tenetur voluptas, nulla alias ab ea dignissimos
          reiciendis nemo incidunt doloremque! Consequatur nemo sequi labore, earum dolorum non.
        </p>
        <p className='my-6'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet quia cumque corrupti,
          tempora nesciunt expedita hic necessitatibus dicta incidunt ad!
        </p>
        <p className='my-6'>
          <Link href='/' className={buttonVariants({ variant: 'outline' })}>
            En savoir plus <ChevronRight />
          </Link>
        </p>
      </article>
    </section>
  );
}
