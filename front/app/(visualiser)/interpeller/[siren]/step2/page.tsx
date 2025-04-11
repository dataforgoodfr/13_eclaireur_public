import Link from 'next/link';

import ElectedPolician from '@/components/ElectedPoliticians/SinglePoliticianCard';
import Stepper from '@/components/Interpellate/Stepper';
import { buttonVariants } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoveRight } from 'lucide-react';

export default async function InterpellateStep2({
  params,
}: {
  params: Promise<{ siren: string }>;
}) {
  const { siren } = await params;
  const currentStep = 2;
  const NUMBER_OF_STEPS = 4;
  return (
    <section id='interpellation-step2' className='my-16'>
      <article>
        <Stepper currentStep={currentStep} numberOfSteps={NUMBER_OF_STEPS} />

        <h2 className='mb-12 mt-6 text-center text-2xl font-bold'>
          Choisissez les élu.e.s à interpeller
        </h2>
        <ul className='flex gap-4'>
          <li>
            <ElectedPolician
              name='toto'
              photoSrc='https://placehold.co/200/png'
              fonction='Maire'
              email='johanna.rolland@nantes.com'
            />
          </li>
          <li>
            <ElectedPolician
              name='toti'
              photoSrc=''
              fonction='Maire'
              email='johanna.rolland@nantes.com'
            />
          </li>
          <li>
            <ElectedPolician
              name='Jackie'
              photoSrc=''
              fonction='Adjointe au maire'
              email='jaqueline-d@nantes.com'
            />
          </li>
        </ul>
      </article>
      <div className='my-12 flex justify-center gap-4'>
        <Link
          href={`/interpeller/${siren}/step1`}
          className={buttonVariants({
            variant: 'outline',
            className: 'min-w-[200] bg-black text-white',
          })}
        >
          <ChevronLeft /> Revenir
        </Link>
        <Link
          href={`/interpeller/${siren}/step3`}
          className={buttonVariants({
            variant: 'outline',
            className: 'min-w-[200] bg-black text-white',
          })}
        >
          Continuer <ChevronRight />
        </Link>
      </div>
    </section>
  );
}
