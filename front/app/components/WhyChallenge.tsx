import Image from 'next/image';

import { KnowMore } from './SectionCard';

export default async function WhyChallenge() {
  return (
    <article className='global-margin w-full px-4 py-6 md:py-20'>
      <div className='flex flex-col gap-10 rounded-xl border border-primary-light p-6'>
        <div className='flex flex-col gap-10 rounded-xl bg-muted-border p-6 md:flex-row'>
          <div className='flex flex-col gap-5 md:w-2/3'>
            <h2 className='text-h2'>Pourquoi interpeller vos élus ?</h2>
            <div className='grid gap-4'>
              <div>
                <div className='grid gap-4'>
                  <p className='text-lg font-bold'>
                    Interpeller vos élu·es, c'est leur rappeler leur responsabilité démocratique et
                    les encourager à mieux rendre compte de l'utilisation des fonds publics.
                  </p>
                  <p className='text-lg'>
                    Les collectivités sont légalement tenues de publier leurs données d'intérêt
                    général en open data, selon la loi pour une République Numérique de 2016.
                    Pourtant, la grande majorité ne respecte pas pleinement cette obligation.
                  </p>
                </div>
                <KnowMore href='/le-projet'></KnowMore>
              </div>
            </div>
          </div>
          <div className='ml-4 flex items-center justify-center md:w-1/3'>
            <Image
              src='/eclaireur/mascotte_call.svg'
              alt='Why challenge'
              className='w-full object-contain md:scale-x-[-1] md:transform'
              width={324}
              height={277}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
