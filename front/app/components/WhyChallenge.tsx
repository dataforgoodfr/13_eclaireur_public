import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

export default async function WhyChallenge() {
  return (
    <article className='global-margin w-full px-4 py-6 md:py-20'>
      <div className='flex flex-col gap-10 rounded-xl border border-primary-light p-6'>
        <div className='flex flex-col gap-10 rounded-xl bg-muted-border p-6 md:flex-row'>
          <div className='flex flex-col gap-10 md:w-2/3'>
            <h2 className='text-h2 mb-5'>Pourquoi interpeller mes élus ?</h2>
            <div className='grid gap-4'>
              <div>
                <div className='grid gap-4'>
                  <p className='text-lg font-bold'>
                    Interpeller vos élu·es, c'est leur rappeler leur responsabilité démocratique et
                    les encourager à mieux rendre compte de l'utilisation des fonds publics.
                  </p>
                  <p className='text-lg'>
                    Les collectivités sont légalement tenues de publier leurs données
                    administratives en open data selon la loi pour une République Numérique de 2016,
                    comme décrit en détail sur notre page consacrée au cadre règlementaire. Seules
                    10% d'entre elles respectent cette obligation.
                  </p>
                </div>
                <Link
                  href={'/le-projet'}
                  className='my-10 flex w-40 items-center justify-center rounded-br-xl rounded-tl-xl border border-primary-light bg-white p-2'
                >
                  <span className='me-2 font-bold'>En savoir plus</span>
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
          <div className='flex items-center justify-center md:w-1/3'>
            <Image
              src='/eclaireur/mascotte_call.svg'
              alt='Why challenge'
              className='w-full object-contain'
              width={324}
              height={277}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
