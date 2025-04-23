'use client';

import { useState } from 'react';

import { MarchePublic } from '@/app/models/marchePublic';

import { GraphSwitch } from '../DataViz/GraphSwitch';
import DownloadButton from '../FicheSubventions/DownloadButton';
import MarchesPublicsTrendsBarChart from './MarchesPublicsTrendsBarChart';

type FormattedDataTrends = {
  annee: number;
  montant: number;
  nombre: number;
};

export default function Trends({ data }: { data: MarchePublic[] }) {
  const [isContractDisplayed, setIsContractDisplayed] = useState(false);

  const trends: FormattedDataTrends[] = Object.values(
    data.reduce<Record<string, FormattedDataTrends>>((acc, item) => {
      const year = item.datenotification_annee;

      if (!acc[year]) {
        acc[year] = { annee: year, montant: 0, nombre: 0 };
      }
      acc[year].montant += parseFloat(String(item.montant)) || 0;
      acc[year].nombre += 1;

      return acc;
    }, {}),
  );

  console.log(trends);

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
      {!isContractDisplayed ? (
        <MarchesPublicsTrendsBarChart data={trends} datakey='montant' />
      ) : (
        <MarchesPublicsTrendsBarChart data={trends} datakey='nombre' />
      )}
      {/* <ResponsiveContainer width='100%' height={CHART_HEIGHT}>
          <BarChart
            width={500}
            height={300}
            data={trends}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='annee' />
            <Legend
              formatter={(value) => {
                const legendLabels: Record<string, string> = {
                  Montant: 'Montant total annuel (€)',
                  Nombre: 'Nombre de marchés',
                };
                return legendLabels[value] || value;
              }}
            />
            {isContractDisplayed ? (
              <Bar dataKey='nombre' fill='#ff7300' radius={[10, 10, 0, 0]}>
                <LabelList dataKey='nombre' position='top' />
              </Bar>
            ) : (
              <Bar dataKey='montant' fill='#413ea0' radius={[10, 10, 0, 0]}>
                <LabelList content={renderLabel} />
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer> */}
    </>
  );
}
