'use client';

import { useState } from 'react';

import DownloadButton from './DownloadButton';
import { SubventionYearlyAmountsChart } from './SubventionYearlyAmountsChart';
import { SubventionyearlyCountsChart } from './SubventionYearlyCountsChart';

type EvolutionProps = {
  siren: string;
};

export default function Evolution({ siren }: EvolutionProps) {
  const [isSubventionsCountDisplayed, setIsSubventionsCountDisplayed] = useState(false);

  return (
    <>
      <div className='flex items-baseline justify-between'>
        <h3 className='pb-2 pt-10 text-center text-2xl font-medium'>
          Évolution des subventions au cours du temps
        </h3>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <DownloadButton label='CSV' />
            <DownloadButton label='PNG' />
          </div>
        </div>
      </div>
      <div className='p-4'>
        {isSubventionsCountDisplayed ? (
          <SubventionyearlyCountsChart siren={siren} />
        ) : (
          <SubventionYearlyAmountsChart siren={siren} />
        )}
      </div>
      <div className='flex items-center justify-center gap-2 pt-2'>
        <div
          className={`rounded-md px-3 py-2 text-base shadow hover:cursor-pointer hover:bg-black hover:text-white ${!isSubventionsCountDisplayed && 'bg-black text-white'}`}
          onClick={() => setIsSubventionsCountDisplayed(false)}
        >
          Montants des subventions versées
        </div>
        <div
          className={`rounded-md px-3 py-2 text-base shadow hover:cursor-pointer hover:bg-black hover:text-white ${isSubventionsCountDisplayed && 'bg-black text-white'}`}
          onClick={() => setIsSubventionsCountDisplayed(true)}
        >
          Nombre de subventions publiées
        </div>
      </div>
    </>
  );
}
