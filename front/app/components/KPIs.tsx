import type { HTMLAttributes } from 'react';

import { KPI_REFERENCE_YEAR } from '#utils/constants/years';
import { fetchKPIs } from '#utils/fetchers/kpis/fetchKPIs';
import { cn, formatCompactPrice, formatNumberInteger } from '#utils/utils';

const KPIS_YEAR = KPI_REFERENCE_YEAR;

export default async function KPIs() {
  const kpis = await fetchKPIs(KPIS_YEAR);

  return (
    <div className='flex flex-col gap-10'>
      <ChiffreCle
        className=''
        value={`${kpis.publishedSubventionsPercentage} %`}
        description='des subventions en montant sont publiées.'
      />
      <ChiffreCle
        value={formatNumberInteger(kpis.communitiesTotalCount)}
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
    <div className={cn('content-center', className)} {...restProps}>
      <h3 className='text-[32px] md:text-[40px]'>{value}</h3>
      <div className='text-lg md:text-[22px]'>{description}</div>
    </div>
  );
}
