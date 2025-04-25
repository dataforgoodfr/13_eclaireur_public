import { HTMLAttributes } from 'react';

import Link from 'next/link';

import { fetchKPIs } from '@/utils/fetchers/kpis/fetchKPIs';
import { cn, formatCompactPrice, formatNumber } from '@/utils/utils';
import { ArrowRight } from 'lucide-react';

const KPIS_YEAR = 2023;

export default async function ProjectDescription() {
  const kpis = await fetchKPIs(KPIS_YEAR);

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
              <ul className='list-inside list-disc'>
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
          <div className='grid grid-cols-1 place-content-center gap-10 pb-20 xl:grid-cols-2'>
            <ChiffreCle
              className='rotate-[3deg] shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]'
              value={`${kpis.publishedSubventionsPercentage}%`}
              description='des subventions en montant sont publiées.'
            />
            <ChiffreCle
              value={formatNumber(kpis.communitiesTotalCount)}
              description='collectivités recensées sur le site.'
            />
            <ChiffreCle
              value={formatCompactPrice(kpis.subventionsTotalBudget)}
              description='de budget total de subventions dans les collectivités.'
            />
            <ChiffreCle
              value={`${kpis.communitiesGoodScoresPercentage}%`}
              description='des collectivités ont un score A ou B.'
            />
          </div>
        </div>
      </article>
    </main>
  );
}

type ChiffreCleProps = {
  value: string | number;
  description: string;
} & HTMLAttributes<HTMLDivElement>;

function ChiffreCle({ value, description, className, ...restProps }: ChiffreCleProps) {
  return (
    <div className={cn('h-48 content-center rounded border px-6', className)} {...restProps}>
      <p className='pb-4 text-2xl font-bold'>{value}</p>
      <p>{description}</p>
    </div>
  );
}
