'use client';

import { useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import YearSelector from '@/app/community/[siren]/components/YearSelector';
import { Switch } from '@/components/ui/switch';

import { YearOption } from '../../types/interface';
import SubventionsSectorTable from './SubventionsSectorTable';
import SubventionsSectorTreemap from './SubventionsSectorTreemap';

type DistributionProps = { siren: string; availableYears: number[] };

export default function Distribution({ siren, availableYears }: DistributionProps) {
  const [selectedYear, setSelectedYear] = useState<YearOption>('All');
  const [isTableDisplayed, setIsTableDisplayed] = useState(false);

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>Répartition par secteur</h3>
          <div className='flex items-baseline gap-2'>
            <div
              onClick={() => {
                setIsTableDisplayed(false);
              }}
              className={`cursor-pointer ${!isTableDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              (graphique
            </div>
            <Switch
              checked={isTableDisplayed}
              onCheckedChange={() => {
                setIsTableDisplayed((prev) => !prev);
              }}
            />
            <div
              onClick={() => {
                setIsTableDisplayed(true);
              }}
              className={`cursor-pointer ${isTableDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              tableau)
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <YearSelector years={availableYears} onSelect={setSelectedYear} />
          <DownloadSelector />
        </div>
      </div>
      {isTableDisplayed ? (
        <SubventionsSectorTable siren={siren} year={selectedYear} />
      ) : (
        <SubventionsSectorTreemap siren={siren} year={selectedYear} />
      )}
    </>
  );
}
