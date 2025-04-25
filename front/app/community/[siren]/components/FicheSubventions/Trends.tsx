'use client';

import { useState } from 'react';

import { Subvention } from '@/app/models/subvention';

import DownloadButton from './DownloadButton';
import SubventionTrendsBarChart from './SubventionTrendsBarChart';
import SubventionTrendsStackedBarChart from './SubventionTrendsStackedBarChart';

type Trends = {
  annee: number;
  montant: number;
  nombre: number;
  budget?: number;
};

export default function Trends({ data }: { data: Subvention[] }) {
  const [isSubventionsCountDisplayed, setIsSubventionsCountDisplayed] = useState(false);

  function calculateTrends(data: Subvention[]) {
    const subventionsByYear: Trends[] = Object.values(
      data.reduce<Record<string, Trends>>((acc, item) => {
        const year = item.year;

        if (!acc[year]) {
          acc[year] = { annee: year, montant: 0, nombre: 0 };
        }
        acc[year].montant += parseFloat(String(item.montant)) || 0;
        acc[year].nombre += 1;

        return acc;
      }, {}),
    );

    // TODO : ajouter le montant budgeté
    // Fake budget
    const formattedData = subventionsByYear.map((item) => {
      const budget = item.montant * (1 + Math.random() * 3);
      const stackedBudget = budget - item.montant;
      const tauxPublication = item.montant / budget;

      return { ...item, budget, stackedBudget, tauxPublication };
    });

    return formattedData;
  }

  const formattedData = calculateTrends(data);

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
      {!isSubventionsCountDisplayed && <SubventionTrendsStackedBarChart data={formattedData} />}
      {isSubventionsCountDisplayed && <SubventionTrendsBarChart data={formattedData} />}
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
          Nombre de subventions attribuées
        </div>
      </div>
    </>
  );
}
