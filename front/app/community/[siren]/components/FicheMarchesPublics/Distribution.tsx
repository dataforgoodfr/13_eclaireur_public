'use client';

import { useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import YearSelector from '@/app/community/[siren]/components/YearSelector';
import { MarchePublic } from '@/app/models/marchePublic';
import { Switch } from '@/components/ui/switch';

import { YearOption } from '../../types/interface';
import MarchesPublicsSectorTable from './MarchesPublicsSectorTable';
import MarchesPublicsSectorTreemap from './MarchesPublicsSectorTreeMap';

function getAvailableYears(data: MarchePublic[]) {
  return [
    ...new Set(
      data.map(
        (item) => item.datenotification_annee && item.montant && item.datenotification_annee,
      ),
    ),
  ].sort((a: number, b: number) => a - b);
}

type DistributionProps = { siren: string; availableYears: number[] };

export default function Distribution({ siren, availableYears }: DistributionProps) {
  const [selectedYear, setSelectedYear] = useState<YearOption>('All');
  const [tableDisplayed, setTableDisplayed] = useState(false);

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>Répartition </h3>
          <div className='flex items-baseline gap-2'>
            <div
              onClick={() => {
                setTableDisplayed(false);
              }}
              className={`cursor-pointer ${!tableDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              (graphique
            </div>
            <Switch
              checked={tableDisplayed}
              onCheckedChange={() => {
                setTableDisplayed((prev) => !prev);
              }}
            />
            <div
              onClick={() => {
                setTableDisplayed(true);
              }}
              className={`cursor-pointer ${tableDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
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
      {tableDisplayed ? (
        <MarchesPublicsSectorTable siren={siren} year={selectedYear} />
      ) : (
        <MarchesPublicsSectorTreemap siren={siren} year={selectedYear} />
      )}
    </>
  );
}
