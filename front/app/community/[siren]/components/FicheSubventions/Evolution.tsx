'use client';

import { useState } from 'react';

import { ActionButton } from '#components/ui/action-button';
import { Download } from 'lucide-react';

import { GraphSwitch } from '../DataViz/GraphSwitch';
import { TabHeader } from '../TabHeader';
import { SubventionsChart } from './SubventionsChart';

type EvolutionProps = {
  siren: string;
};

export default function Evolution({ siren }: EvolutionProps) {
  const [isSubventionsCountDisplayed, setIsSubventionsCountDisplayed] = useState(false);

  const handleDownloadClick = () => {
    // TODO: Add download functionality
    console.log('Download clicked');
    // Peut ouvrir un menu dropdown pour choisir entre CSV et PNG
  };

  return (
    <div className='w-full'>
      <TabHeader
        title='Évolution des subventions au cours du temps'
        titleSwitch={
          <GraphSwitch
            isActive={isSubventionsCountDisplayed}
            onChange={setIsSubventionsCountDisplayed}
            label1='Montants annuels'
            label2='Nombre de subventions'
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
      <div className='p-4 md:p-6'>
        <SubventionsChart
          siren={siren}
          displayMode={isSubventionsCountDisplayed ? 'counts' : 'amounts'}
        />
      </div>
    </div>
  );
}
