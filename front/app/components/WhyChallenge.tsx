import Link from 'next/link';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';


export default async function WhyChallenge() {
  return (
    <main className="w-full global-margin">
      <article className='py-20 px-4'>
        <div className='flex flex-col gap-10 border border-primary-light rounded-xl p-6'>
          <div className='flex flex-col md:flex-row gap-10 bg-muted-border rounded-xl p-6'>
            <div className='flex flex-col gap-10 md:w-2/3'>
              <h2 className='mb-5 text-h2'>Pourquoi interpeller mes élus ?</h2>
              <div className='grid gap-4'>
                <div>
                  <div className='grid gap-4'>
                    <p className='text-lg font-bold'>
                      Interpeller vos élu·es, c'est leur rappeler leur responsabilité démocratique et les 
                      encourager à mieux rendre compte de l'utilisation des fonds publics.
                    </p>
                    <p className='text-lg'>
                      Les collectivités sont légalement tenues de publier leurs données administratives en open data 
                      selon la loi pour une République Numérique de 2016, comme décrit en détail sur notre page consacrée 
                      au cadre règlementaire. Seules 10% d'entre elles respectent cette obligation.
                    </p>
                  </div>
                  <Link
                    href={'/le-projet'}
                    className='my-10 p-2 flex w-40 items-center justify-center rounded-br-xl rounded-tl-xl bg-white border border-primary-light'
                  >
                    <span className='me-2 font-bold'>En savoir plus</span>
                    <ArrowRight />
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center md:w-1/3">
              <Image
                src="/eclaireur/mascotte_call.svg"
                alt="Why challenge"
                className="w-full object-contain"
                width={324}
                height={277}
              />
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
