import { HTMLAttributes } from 'react';

import { fetchKPIs } from '@/utils/fetchers/kpis/fetchKPIs';
import { cn, formatCompactPrice, formatNumber } from '@/utils/utils';

const KPIS_YEAR = 2023;

export default async function KPIs() {
  const kpis = await fetchKPIs(KPIS_YEAR);

  return (
    <div className='grid grid-cols-1 place-content-center gap-10 pb-20 xl:grid-cols-2'>
      <ChiffreCle
        className='rotate-[3deg] shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]'
        value={`${kpis.publishedSubventionsPercentage} %`}
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
        value={`${kpis.communitiesGoodScoresPercentage} %`}
        description='des collectivités ont un score A ou B.'
      />
    </div>
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
