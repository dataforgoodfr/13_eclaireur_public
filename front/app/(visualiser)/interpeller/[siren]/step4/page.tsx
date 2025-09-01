import Image from 'next/image';
import Link from 'next/link';

import { CopyPasteButtons } from '#components/Interpellate/CopyPasteButtons';
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
            className='align-center mb-16 rounded-t-3xl bg-[url(/eclaireur/project_background.webp)] bg-bottom px-8 py-12 md:flex-row md:gap-0'
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
            <div id='input-wrapper' className='relative mx-auto block h-14 w-[473px]'>
              <input
                type='url'
                className='z-0 mx-auto block h-14 w-[473px] rounded-none rounded-br-xl rounded-tl-xl border border-input px-3 py-2 pl-4 text-2xl font-bold text-primary ring-offset-background placeholder:text-primary focus:border-primary focus:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed'
                value='www.eclaireurpublic.org'
              />
              <CopyPasteButtons className='absolute right-0 top-0 z-10' />
            </div>
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
