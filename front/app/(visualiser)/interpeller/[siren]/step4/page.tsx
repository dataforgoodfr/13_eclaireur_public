import Link from 'next/link';

import Stepper from '@/components/Interpellate/Stepper';
import { buttonVariants } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default async function InterpellateStep4({
  params,
}: {
  params: Promise<{ siren: string }>;
}) {
  const { siren } = await params;
  return (
    <section id='interpellation-step4' className='my-16 flex flex-wrap justify-center gap-8'>
      <Stepper currentStep={4} />

      <h2 className='mb-12 mt-6 min-w-full text-center text-2xl font-bold'>
        Message, envoyé,
        <br />
        Bravo pour votre action citoyenne !<br />
        Faites-le savoir autour de vous
      </h2>
      <article className='w-2/5 text-center'>
        <Link href='/'>
          <Image
            src='https://placehold.co/150/png'
            width={150}
            height={150}
            alt='*'
            className='inline'
          />
          <h3>Partagez la page</h3>
          <p>Envoyez le lien vers cette page à votre entourage pour leur proposer la démarche</p>
        </Link>
      </article>
      <article className='w-2/5 text-center'>
        <Link href='/'>
          <Image
            src='https://placehold.co/150/png'
            width={150}
            height={150}
            alt='*'
            className='inline'
          />
          <h3>Parlez-en sur vos réseaux</h3>
          <p>
            Postez un message sur vos réseaux sociaux afin de faire connaître la plateforme
            Eclaireur Public
          </p>
        </Link>
      </article>
      <p className='min-w-full pt-16 text-center'>
        <Link href={`/community/${siren}`} className={buttonVariants({ variant: 'outline' })}>
          Continuer à explorer les données <ChevronRight />
        </Link>
      </p>
    </section>
  );
}
