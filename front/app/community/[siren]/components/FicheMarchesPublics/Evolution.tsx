'use client';

import { useState } from 'react';

import { ActionButton } from '#components/ui/action-button';
import { Download } from 'lucide-react';
import { GraphSwitch } from '../DataViz/GraphSwitch';
import { MarchesPublicsChart } from './MarchesPublicsChart';
import { TabHeader } from './TabHeader';

type EvolutionProps = {
  siren: string;
};

export default function Evolution({ siren }: EvolutionProps) {
  const [isMarchesPublicsCountDisplayed, setIsMarchesPublicsCountDisplayed] = useState(false);

  const handleDownloadClick = () => {
    // TODO: Add download functionality
    console.log('Download clicked');
    // Peut ouvrir un menu dropdown pour choisir entre CSV et PNG
  };

  return (
    <div className='w-full'>
      <TabHeader
        title="Évolution des marchés publics au cours du temps"
        titleSwitch={
          <GraphSwitch
            isActive={isMarchesPublicsCountDisplayed}
            onChange={setIsMarchesPublicsCountDisplayed}
            label1='Montants annuels'
            label2='Nombre de marchés publics'
          />
        }
        actions={
          <ActionButton
            onClick={handleDownloadClick}
            icon={<Download size={20} />}
            variant='default'
          />
        }
      />

      {/* Chart Section */}
      <div className='bg-white rounded-lg shadow-sm p-4 md:p-6'>
        <MarchesPublicsChart
          siren={siren}
          displayMode={isMarchesPublicsCountDisplayed ? 'counts' : 'amounts'}
        />
      </div>
    </div>
  );
}