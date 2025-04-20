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
    <div className='px-20 py-16'>
      <h2 className='mb-5 text-3xl font-bold uppercase'>Le projet</h2>
      <div className='grid gap-8 md:grid-cols-2'>
        <div>
          <div className='mb-3 space-y-3 pr-10 text-lg'>
            <p>
              Éclaireur Public est une initiative portée par Transparency International France et
              Anticor. Le projet vise à pallier le manque de transparence dans la gestion des
              dépenses publiques des collectivités locales en France.
            </p>
            <p>
              Depuis l’adoption de la loi pour une République numérique (2016), les collectivités
              sont légalement tenues de publier leurs données administratives en open data.
              Cependant, seulement 10% d'entre elles respectent cette obligation. Cette situation
              limite considérablement la capacité des citoyens, des journalistes et des
              organisations de lutte contre la corruption à surveiller l’utilisation des fonds
              publics.
            </p>
            <p>
              Avec un budget annuel total de 65 milliards d'euros (45 milliards pour la commande
              publique et 20 milliards pour les subventions), une meilleure transparence est
              essentielle pour détecter d'éventuelles irrégularités et renforcer la confiance des
              citoyens dans leurs institutions locales.
            </p>
          </div>
          <Link
            href={'/'}
            className='flex w-40 items-center justify-center rounded bg-black p-2 text-white hover:bg-neutral-800'
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
          <ChiffreCle value='XMd€' description='Budget national des collectivités' />
          <ChiffreCle value='XXX' description='XXX' />
        </div>
      </div>
    </div>
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
