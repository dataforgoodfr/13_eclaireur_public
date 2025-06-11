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
      const year = Number(item.annee_notification);

      if (!acc[year]) {
        acc[year] = { annee: year, yValue: 0 };
      }
      acc[year].yValue += 1;

      return acc;
    }, {}),
  );

  const initalList: ChartData[] = [];
  for (let i = 0; i <= 7; i++) {
    initalList.push({
      annee: new Date(Date.now()).getFullYear() - 7 + i,
      yValue: 0,
    });
  }

  const contractNumberTrendsData: ChartData[] = initalList.map((el) => {
    const found = contractNumberTrends.find((item) => item.annee === el.annee);
    return { ...el, yValue: found?.yValue ?? el.yValue };
  });
  
  
  const contractAmountTrends: ChartData[] = Object.values(
    data.reduce<Record<string, ChartData>>((acc, item) => {
      const year = Number(item.annee_notification);
      
      if (!acc[year]) {
        acc[year] = { annee: year, yValue: 0 };
      }
      acc[year].yValue += parseFloat(String(item.montant)) || 0;
      
      return acc;
    }, {}),
  );
  
  const contractAmountTrendsData: ChartData[] = initalList.map((el) => {
    const found = contractAmountTrends.find((item) => item.annee === el.annee);
    return { ...el, yValue: found?.yValue ?? el.yValue };
  });
  
  return (
    <>
      <div className='flex items-baseline justify-between'>
        <div>
          <h3 className='pb-2 pt-10 text-center text-2xl font-medium'>
            Évolution des marchés publics au cours du temps
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
        data={isContractDisplayed ? contractNumberTrendsData : contractAmountTrendsData}
        isContractDisplayed={isContractDisplayed}
      />
    </>
  );
}
