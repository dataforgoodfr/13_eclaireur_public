'use client';

import { useState } from 'react';

import { GraphSwitch } from '../DataViz/GraphSwitch';
import DownloadButton from '../FicheSubventions/DownloadButton';
import { MarchesPublicsYearlyAmountsChart } from './MarchesPublicsYearlyAmountsChart';
import { MarchesPublicsYearlyCountsChart } from './MarchesPublicsYearlyCountsChart';

type EvolutionProps = {
  siren: string;
};

export default function Evolution({ siren }: EvolutionProps) {
  const [isMarchesPublicsCountDisplayed, setIsMarchesPublicsCountDisplayed] = useState(false);

  return (
    <>
      <div className='flex items-baseline justify-between'>
        <div>
          <h3 className='pb-2 pt-10 text-center text-2xl font-medium'>
            Évolution des marchés publics au cours du temps
          </h3>
          <GraphSwitch
            isActive={isMarchesPublicsCountDisplayed}
            onChange={setIsMarchesPublicsCountDisplayed}
            label1='Montants annuels'
            label2='Nombre de marchés publics'
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
        {isMarchesPublicsCountDisplayed ? (
          <MarchesPublicsYearlyCountsChart siren={siren} />
        ) : (
          <MarchesPublicsYearlyAmountsChart siren={siren} />
        )}
      </div>
    </>
  );
}
