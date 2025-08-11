'use client';

import { useState } from 'react';

import { GraphSwitch } from '../DataViz/GraphSwitch';
import { MarchesPublicsChart } from './MarchesPublicsChart';
import { ActionButton } from '#components/ui/action-button';
import { Download } from 'lucide-react';
import { TransparencyScoreBar } from '#components/TransparencyScore/TransparencyScoreBar';
import TooltipScore from '../TransparencyScore/TooltipScore';
import type { TransparencyScore } from '#components/TransparencyScore/constants';

type EvolutionProps = {
  siren: string;
  transparencyIndex?: TransparencyScore | null;
};

export default function Evolution({ siren, transparencyIndex }: EvolutionProps) {
  const [isMarchesPublicsCountDisplayed, setIsMarchesPublicsCountDisplayed] = useState(false);

  const handleDownloadClick = () => {
    // TODO: Add download functionality
    console.log('Download clicked');
    // Peut ouvrir un menu dropdown pour choisir entre CSV et PNG
  };

  return (
    <div className='w-full'>
      {/* Header Section - Desktop */}
      <div className='hidden md:flex items-start justify-between mb-6'>
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-4'>
            <h3 className='text-2xl font-medium text-primary'>
              Évolution des marchés publics au cours du temps
            </h3>
            {transparencyIndex && (
              <div className='flex items-center gap-2'>
                <div className='text-sm text-gray-600'>Indice de transparence:</div>
                <TransparencyScoreBar 
                  score={transparencyIndex} 
                  className='max-w-xs'
                  responsive={false}
                />
                <TooltipScore />
              </div>
            )}
          </div>
          <GraphSwitch
            isActive={isMarchesPublicsCountDisplayed}
            onChange={setIsMarchesPublicsCountDisplayed}
            label1='Montants annuels'
            label2='Nombre de marchés publics'
          />
        </div>
        <ActionButton
          onClick={handleDownloadClick}
          icon={<Download size={20} />}
          variant='default'
          className='ml-4'
        />
      </div>

      {/* Header Section - Mobile */}
      <div className='md:hidden mb-6'>
        <div className='flex items-start justify-between mb-4'>
          <h3 className='text-xl font-medium text-primary leading-tight flex-1 pr-2'>
            Évolution des marchés publics au cours du temps
          </h3>
          <ActionButton
            onClick={handleDownloadClick}
            icon={<Download size={20} />}
            variant='default'
          />
        </div>
        {transparencyIndex && (
          <div className='mb-4'>
            <div className='text-sm text-gray-600 mb-2 flex items-center gap-2'>
              Indice de transparence:
              <TooltipScore />
            </div>
            <TransparencyScoreBar 
              score={transparencyIndex} 
              className='max-w-sm'
            />
          </div>
        )}
        <GraphSwitch
          isActive={isMarchesPublicsCountDisplayed}
          onChange={setIsMarchesPublicsCountDisplayed}
          label1='Montants annuels'
          label2='Nombre de marchés publics'
        />
      </div>

      {/* Chart Section */}
      <div className='bg-white rounded-lg shadow-sm border-2 border-primary p-4 md:p-6'>
        <MarchesPublicsChart 
          key={isMarchesPublicsCountDisplayed ? 'counts' : 'amounts'}
          siren={siren} 
          displayMode={isMarchesPublicsCountDisplayed ? 'counts' : 'amounts'}
          barColor='#E8F787'
          borderColor='#303F8D'
        />
      </div>
    </div>
  );
}