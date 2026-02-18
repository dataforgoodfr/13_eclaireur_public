import type { HTMLAttributes } from 'react';

import { fetchKPIs } from '#utils/fetchers/kpis/fetchKPIs';
import { cn, formatMilliardsPrice, formatNumberInteger } from '#utils/utils';

export default async function KPIs() {
  const kpis = await fetchKPIs();

  return (
    <div className='flex flex-col gap-10'>
      <ChiffreCle
        value={formatNumberInteger(kpis.collectivitesSoumises)}
        description="collectivités soumises à l'obligation de publication."
      />
      <ChiffreCle
        value={formatMilliardsPrice(kpis.montantTotal)}
        description='de marchés publics et subventions analysés depuis 2016.'
      />
      <ChiffreCle
        value={`${kpis.pctScoreABMp} %`}
        description='des collectivités ont un score A ou B sur les marchés publics (2024).'
      />
      <ChiffreCle
        value={`${kpis.pctSubPubliees} %`}
        description='des subventions en montant sont publiées (2024).'
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
