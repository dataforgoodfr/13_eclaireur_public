'use client';

import { PureComponent, useState } from 'react';

import { Subvention } from '@/app/models/subvention';
import { Switch } from '@/components/ui/switch';
import { formatCompactPrice, formatNumber } from '@/utils/utils';
import {
  Bar,
  BarChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import DownloadButton from './DownloadButton';

type FormattedDataTrends = {
  annee: number;
  montant: number;
  nombre: number;
  budget?: number;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const montantEntry = payload.find((entry: any) => entry.name === 'montant');
    const budgetEntry = payload.find((entry: any) => entry.name === 'stackedBudget');
    const budget = montantEntry.value + budgetEntry.value;
    const tauxPublication =
      montantEntry && budgetEntry
        ? ((montantEntry.value / (montantEntry.value + budgetEntry.value)) * 100).toFixed(1)
        : '0';

    return (
      <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-lg'>
        <p className='font-semibold text-gray-900'>{label}</p>
        <div className='mt-2 space-y-1'>
          {tauxPublication !== 'NaN' && (
            <div className='flex items-center gap-2 pt-1'>
              <span className='text-sm text-gray-600'>Taux de publication</span>
              <span className='text-sm font-medium text-gray-900'>{tauxPublication}%</span>
            </div>
          )}
          {payload.map((entry: any, index: number) => (
            <div key={index} className='flex items-center gap-2'>
              <div className='h-3 w-3 rounded-full' style={{ backgroundColor: entry.color }} />
              <span className='text-sm text-gray-600'>
                {entry.name === 'montant' && 'Subventions publiées'}
                {entry.name === 'stackedBudget' && 'Budget des subventions'}
              </span>
              <span className='text-sm font-medium text-gray-900'>
                {entry.name === 'montant' && formatCompactPrice(entry.value)}
                {entry.name === 'stackedBudget' && formatCompactPrice(budget)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const renderLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text
      x={x + width / 2}
      y={y - 10}
      fill='#4e4e4e'
      textAnchor='middle'
      dominantBaseline='middle'
      fontSize='16'
    >
      {value ? formatCompactPrice(value) : ''}
    </text>
  );
};

export default function Trends({ data }: { data: Subvention[] }) {
  const [subventionsCountDisplayed, setSubventionsCountDisplayed] = useState(false);

  function trends(data: Subvention[]) {
    const subventionsByYear: FormattedDataTrends[] = Object.values(
      data.reduce<Record<string, FormattedDataTrends>>((acc, item) => {
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

  const formattedData = trends(data);
  console.log(formattedData);

  return (
    <>
      {/* VERSION 1 */}
      {/* <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-2xl font-medium'>Évolution des subventions au cours du temps</h3>
          <div className='flex items-baseline gap-2'>
            <div
              onClick={() => setSubventionsCountDisplayed(false)}
              className={`cursor-pointer ${!subventionsCountDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              (Montants annuels
            </div>
            <Switch
              checked={subventionsCountDisplayed}
              onCheckedChange={() => setSubventionsCountDisplayed((prev) => !prev)}
            />
            <div
              onClick={() => setSubventionsCountDisplayed(true)}
              className={`cursor-pointer ${subventionsCountDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              Nombre de subventions)
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <DownloadSelector />
        </div>
      </div> */}
      {/* VERSION 2 */}
      {/* <div>
        <h3 className='pb-8 pt-10 text-center text-2xl font-medium'>
          Évolution des subventions au cours du temps
        </h3>
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-start gap-2'>
            <div
              className={`rounded-md px-3 py-2 text-sm shadow hover:cursor-pointer hover:bg-black hover:text-white ${!subventionsCountDisplayed && 'bg-black text-white'}`}
              onClick={() => setSubventionsCountDisplayed(false)}
            >
              Montants des subventions versées
            </div>
            <div
              className={`rounded-md px-3 py-2 text-sm shadow hover:cursor-pointer hover:bg-black hover:text-white ${subventionsCountDisplayed && 'bg-black text-white'}`}
              onClick={() => setSubventionsCountDisplayed(true)}
            >
              Nombre de subventions attribuées
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <DownloadButton label='CSV'/>
            <DownloadButton label='PNG'/>
          </div>
        </div>
      </div> */}
      {/* VERSION 3 */}
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
      {!subventionsCountDisplayed && (
        <div className='p-4'>
          <ResponsiveContainer width='100%' height={600}>
            <BarChart
              width={500}
              height={300}
              data={formattedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey='annee' axisLine={true} tickLine={true} />
              <YAxis tickFormatter={(value) => formatCompactPrice(value)} />
              <Tooltip
                content={<CustomTooltip />}
                animationDuration={300}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Legend
                verticalAlign='bottom'
                align='center'
                formatter={(value) => {
                  const legendLabels: Record<string, string> = {
                    montant: 'Subventions publiées (€)',
                    stackedBudget: 'Budget des subventions (€)',
                  };
                  return legendLabels[value] || value;
                }}
              />
              <Bar dataKey='montant' stackId='a' fill='#525252' barSize={120}></Bar>
              <Bar dataKey='stackedBudget' stackId='a' fill='#a3a3a3' radius={[10, 10, 0, 0]}>
                <LabelList content={renderLabel} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {subventionsCountDisplayed && (
        <div className='p-4'>
          <ResponsiveContainer width='100%' height={600}>
            <BarChart
              width={500}
              height={300}
              data={formattedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey='annee' axisLine={true} tickLine={true} />
              <YAxis />
              <Legend
                formatter={(value) => {
                  const legendLabels: Record<string, string> = {
                    nombre: 'Nombre de subventions',
                  };
                  return legendLabels[value] || value;
                }}
              />
              <Bar
                dataKey='nombre'
                stackId='a'
                fill='#525252'
                barSize={120}
                radius={[10, 10, 0, 0]}
              >
                <LabelList position='top' formatter={(value: number) => formatNumber(value)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className='flex items-center justify-center gap-2 pt-2'>
        <div
          className={`rounded-md px-3 py-2 text-base shadow hover:cursor-pointer hover:bg-black hover:text-white ${!subventionsCountDisplayed && 'bg-black text-white'}`}
          onClick={() => setSubventionsCountDisplayed(false)}
        >
          Montants des subventions versées
        </div>
        <div
          className={`rounded-md px-3 py-2 text-base shadow hover:cursor-pointer hover:bg-black hover:text-white ${subventionsCountDisplayed && 'bg-black text-white'}`}
          onClick={() => setSubventionsCountDisplayed(true)}
        >
          Nombre de subventions attribuées
        </div>
      </div>
    </>
  );
}
