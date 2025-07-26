import { Suspense } from 'react';

import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import Loading from '../../components/ui/Loading';
import KPIs from './KPIs';

export default async function ProjectDescription() {
  return (
    <main className='mx-auto max-w-screen-xl px-6 py-20'>
      <article>
        <h2 className='mb-5 text-3xl font-bold uppercase'>Le projet</h2>
        <div className='grid gap-12 md:grid-cols-2'>
          <div>
            <div className='mb-3 pr-10 text-lg'>
              <p className='my-6 text-lg'>
                La publication des données administratives d’intérêt général est une obligation pour
                toutes les collectivités depuis la loi pour Une République Numérique de 2016.
              </p>
              <p className='my-6 text-lg'>
                A peine 10% des collectivités remplissent cette obligation.
              </p>
              <p className='my-6 text-lg'>
                Pour Transparency International France et Anticor, la confiance des citoyens dans
                leurs institutions locales passe par l’exemplarité de ces institutions.
              </p>
              <p className='my-6 text-lg'>
                Pour ce faire, le projet Eclaireur Public vise à renforcer l’application de la loi à
                travers 2 axes :
              </p>
              <ul className='ml-5 list-disc'>
                <li>
                  Inciter à ouvrir les données publiques de toutes les collectivités et
                  administrations,
                </li>
                <li>Porter ces données à la connaissance des citoyens</li>
              </ul>
            </div>
            <Link
              href={'/le-projet'}
              className='my-10 flex w-40 items-center justify-center rounded bg-black p-2 text-white hover:bg-neutral-800'
            >
              <span className='me-2'>En savoir plus</span>
              <ArrowRight />
            </Link>
          </div>
          <Suspense fallback={<Loading />}>
            <KPIs />
          </Suspense>
        </div>
      </article>
    </main>
  );
}
