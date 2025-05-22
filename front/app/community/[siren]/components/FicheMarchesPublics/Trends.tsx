'use client';

import { useState } from 'react';

import { MarchePublic } from '@/app/models/marchePublic';

import { GraphSwitch } from '../DataViz/GraphSwitch';
import DownloadButton from '../FicheSubventions/DownloadButton';
import MarchesPublicsTrendsBarChart from './MarchesPublicsTrendsBarChart';

type ChartData = {
  annee: number;
  yValue: number;
};

export default function Trends({ data }: { data: MarchePublic[] }) {
  const [isContractDisplayed, setIsContractDisplayed] = useState(false);

  const contractNumberTrends: ChartData[] = Object.values(
    data.reduce<Record<string, ChartData>>((acc, item) => {
      const year = item.annee_notification;

      if (!acc[year]) {
        acc[year] = { annee: year, yValue: 0 };
      }
      acc[year].yValue += 1;

      return acc;
    }, {}),
  );

  const contractAmountTrends: ChartData[] = Object.values(
    data.reduce<Record<string, ChartData>>((acc, item) => {
      const year = item.annee_notification;

      if (!acc[year]) {
        acc[year] = { annee: year, yValue: 0 };
      }
      acc[year].yValue += parseFloat(String(item.montant)) || 0;

      return acc;
    }, {}),
  );

  return (
    <>
      <div className='flex items-baseline justify-between'>
        <div>
          <h3 className='pb-2 pt-10 text-center text-2xl font-medium'>
            Évolution des subventions au cours du temps
          </h3>
          <GraphSwitch
            isActive={isContractDisplayed}
            onChange={setIsContractDisplayed}
            label1='Montants annuels'
            label2='Nombre de contrats'
          />
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <DownloadButton label='CSV' />
            <DownloadButton label='PNG' />
          </div>
        </div>
      </div>
      <MarchesPublicsTrendsBarChart
        data={isContractDisplayed ? contractNumberTrends : contractAmountTrends}
        isContractDisplayed={isContractDisplayed}
      />
    </>
  );
}
