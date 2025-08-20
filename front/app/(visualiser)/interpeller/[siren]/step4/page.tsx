import Image from 'next/image';
import Link from 'next/link';

// TODO: Review and remove unused variables. This file ignores unused vars for now.
/* eslint-disable @typescript-eslint/no-unused-vars */

import Stepper from '#components/Interpellate/Stepper';
import { Button } from '#components/ui/button';

export default async function InterpellateStep4({
  params,
}: {
  params: Promise<{ siren: string }>;
}) {
  // const { siren } = await params;
  return (
    <>
      <div className='bg-muted-border pb-32'>
        <Stepper currentStep={4} />
      </div>
      <section className='global-margin mb-16 mt-[-7rem]'>
        <article className='rounded-3xl border border-primary-light pb-12 shadow'>
          <div
            id='header-article'
            className='align-center mb-16 rounded-t-3xl bg-[url(/eclaireur/project_background.jpg)] bg-bottom px-8 py-12 md:flex-row md:gap-0'
          >
            <h2 className='text-center'> Bravo pour votre action citoyenne !</h2>
          </div>

          <Image
            src='/eclaireur/mascotte_reward.png'
            alt='Interpeller'
            width={150}
            height={129}
            className='mx-auto block'
          />
          <h3 className='mb-12 mt-6 px-8 text-center'>
            Faites-le savoir autour de vous
            <br />
            partagez éclaireur public à votre entourage :
          </h3>

          <div>
            <Image
              src='/eclaireur/partager_EP.png'
              alt='Interpeller'
              width={473}
              height={56}
              className='mx-auto block'
            />
          </div>
        </article>

        <Button
          size='lg'
          className='mx-auto mt-8 block rounded-none rounded-br-lg rounded-tl-lg bg-primary hover:bg-primary/90'
        >
          <Link href='/interpeller' className=''>
            <Image
              src='/eclaireur/interpeller.svg'
              alt='Interpeller'
              width={20}
              height={20}
              className='mr-2 inline-block'
            />
            Interpeller une autre collectivité
          </Link>
        </Button>
      </section>
    </>
  );
}
