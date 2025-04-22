import Link from 'next/link';

import { fetchCommunitiesTotalCount } from '@/utils/fetchers/kpis/fetchCommunitiesTotalCount';
import { fetchPublishedSubventionsTotal } from '@/utils/fetchers/kpis/fetchPublishedSubventionsTotal';
import { fetchSubventionsTotalBudget } from '@/utils/fetchers/kpis/fetchSubventionsTotalBudget';
import { ArrowRight } from 'lucide-react';

const KPIS_YEAR = 2023;

export default async function ProjectDescription() {
  const communitiesTotalCount = await fetchCommunitiesTotalCount();
  const publishedSubventionsTotal = await fetchPublishedSubventionsTotal(KPIS_YEAR);
  const subventionsTotalBudget = await fetchSubventionsTotalBudget(KPIS_YEAR);

  return (
    <main className='px-20 py-16'>
      <article>
        <h2 className='mb-5 text-3xl font-bold uppercase'>Le projet</h2>
        <div className='grid gap-8 md:grid-cols-2'>
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
          <div className='grid grid-cols-1 justify-items-center gap-4 xl:grid-cols-2 2xl:px-20'>
            <ChiffreCle value='0%' description='Des dépenses françaises sont publiées' />
            <ChiffreCle
              value={communitiesTotalCount}
              description='Collectivités recensées sur le site'
            />
            <ChiffreCle value='XMd€' description='Budget total des collectivités' />
            <ChiffreCle value='XXX' description='XXX' />
          </div>
        </div>
      </article>
    </main>
  );
}

type ChiffreCleProps = {
  value: string | number;
  description: string;
};

function ChiffreCle({ value, description }: ChiffreCleProps) {
  return (
    <div className='h-48 w-64 content-center border px-6'>
      <p className='text-2xl font-bold'>{value}</p>
      <p className=''>{description}</p>
    </div>
  );
}
