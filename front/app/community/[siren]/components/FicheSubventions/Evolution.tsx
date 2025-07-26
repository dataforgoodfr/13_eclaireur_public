'use client';

import { useState } from 'react';

import { GraphSwitch } from '../DataViz/GraphSwitch';
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
        <div>
          <h3 className='pb-2 pt-10 text-center text-2xl font-medium'>
            Évolution des subventions au cours du temps
          </h3>
          <GraphSwitch
            isActive={isSubventionsCountDisplayed}
            onChange={setIsSubventionsCountDisplayed}
            label1='Montants annuels'
            label2='Nombre de subventions'
          />
        </div>
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
    </>
  );
}
